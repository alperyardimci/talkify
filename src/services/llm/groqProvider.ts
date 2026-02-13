// ============================================
// Talkify - Groq Cloud LLM Provider
// ============================================

import type { LLMConfig, LLMProvider, LLMProviderType } from '@/src/types';
import Constants from 'expo-constants';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface GroqModel {
  id: string;
  object: string;
  owned_by: string;
}

interface GroqModelsResponse {
  data: GroqModel[];
}

/**
 * Groq API key'ini alır: önce config'den, yoksa Constants.expoConfig.extra'dan.
 */
function resolveApiKey(configKey?: string): string {
  if (configKey) return configKey;
  const extraKey = Constants.expoConfig?.extra?.groqApiKey;
  return typeof extraKey === 'string' ? extraKey : '';
}

/**
 * Groq API'sinden mevcut modelleri getirir.
 */
export async function fetchGroqModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(`${GROQ_API_BASE}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Groq API hata döndü: ${response.status}`);
    }

    const data: GroqModelsResponse = await response.json();
    return data.data.map((m) => m.id);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Groq API\'ye bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }
    throw error;
  }
}

/**
 * Groq API bağlantı testi yapar.
 */
export async function testGroqConnection(apiKey: string): Promise<boolean> {
  try {
    if (!apiKey || apiKey === 'gsk_xxxxx') return false;

    const response = await fetch(`${GROQ_API_BASE}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Groq Cloud API üzerinden LLM erişimi sağlayan provider.
 * OpenAI-compatible chat/completions endpoint kullanır.
 */
export class GroqProvider implements LLMProvider {
  readonly type: LLMProviderType = 'groq';

  private apiKey: string = '';
  private model: string = 'llama-3.3-70b-versatile';
  private temperature: number = 0.8;
  private maxTokens: number = 1024;

  async isAvailable(): Promise<boolean> {
    const key = this.apiKey || resolveApiKey();
    return testGroqConnection(key);
  }

  async initialize(config: LLMConfig): Promise<void> {
    this.apiKey = resolveApiKey(config.groqApiKey);
    this.model = config.groqModel || 'llama-3.3-70b-versatile';
    this.temperature = config.temperature ?? 0.8;
    this.maxTokens = config.maxTokens ?? 1024;

    if (!this.apiKey || this.apiKey === 'gsk_xxxxx') {
      throw new Error(
        'Groq API anahtarı bulunamadı. Ayarlar\'dan API anahtarınızı girin veya .env dosyasına ekleyin.'
      );
    }
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API anahtarı ayarlanmadı. Önce initialize() çağrılmalıdır.');
    }

    const messages: GroqChatMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Bilinmeyen hata');
        if (response.status === 429) {
          throw new Error(
            'Groq API hız limiti aşıldı. Lütfen bir dakika bekleyip tekrar deneyin.'
          );
        }
        if (response.status === 401) {
          throw new Error('Groq API anahtarı geçersiz. Ayarlar\'dan kontrol edin.');
        }
        throw new Error(`Groq API hatası (${response.status}): ${errorText}`);
      }

      const data: GroqChatResponse = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Groq API boş yanıt döndü.');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Groq API ile iletişim kesildi. İnternet bağlantınızı kontrol edin.'
        );
      }
      throw error;
    }
  }

  async release(): Promise<void> {
    // Cloud API için temizlik işlemi gerekmiyor
  }
}
