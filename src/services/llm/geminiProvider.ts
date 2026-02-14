// ============================================
// Talkify - Google Gemini LLM Provider
// ============================================

import type { LLMConfig, LLMProvider, LLMProviderType } from '@/src/types';
import Constants from 'expo-constants';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates?: {
    content: {
      parts: GeminiPart[];
      role: string;
    };
    finishReason: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/** Minimum delay between consecutive API calls (15 RPM = 4s/req). */
const THROTTLE_MS = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Build-time injected key (bundled by Metro, not visible at runtime in JS source)
const EMBEDDED_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

function resolveApiKey(): string {
  // 1) Try expo-constants (build-time config via app.config.ts extra)
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const c = Constants as any;
  const extra = c.expoConfig?.extra ?? c.manifest?.extra ?? c.manifest2?.extra?.expoClient?.extra;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const configKey = extra?.geminiApiKey;

  // 2) Fallback: EXPO_PUBLIC_ env var (inlined by Metro at bundle time)
  const key = (typeof configKey === 'string' && configKey) ? configKey : EMBEDDED_KEY;

  console.log(`[Gemini] resolveApiKey: found=${!!key}, configKey=${!!configKey}, embeddedKey=${!!EMBEDDED_KEY}`);
  return key;
}

/**
 * Gemini API bağlantı testi yapar.
 */
export async function testGeminiConnection(apiKey: string): Promise<boolean> {
  try {
    if (!apiKey) return false;
    const response = await fetch(
      `${GEMINI_API_BASE}/models?key=${apiKey}`,
      { method: 'GET' }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Google Gemini API üzerinden LLM erişimi sağlayan provider.
 * Free tier: 15 RPM, 250K TPM, 1000 RPD (Flash-Lite).
 */
export class GeminiProvider implements LLMProvider {
  readonly type: LLMProviderType = 'gemini';

  private apiKey: string = '';
  private model: string = 'gemini-2.0-flash';
  private temperature: number = 0.8;
  private maxTokens: number = 2048;
  private lastCallTime: number = 0;

  async isAvailable(): Promise<boolean> {
    const key = this.apiKey || resolveApiKey();
    return testGeminiConnection(key);
  }

  async initialize(config: LLMConfig): Promise<void> {
    this.apiKey = resolveApiKey();
    this.model = config.geminiModel || 'gemini-2.0-flash';
    this.temperature = config.temperature ?? 0.8;
    this.maxTokens = Math.max(config.maxTokens ?? 4096, 2048);

    console.log(`[Gemini] initialize: apiKey=${this.apiKey ? 'SET' : 'EMPTY'}, model=${this.model}, maxTokens=${this.maxTokens}`);

    if (!this.apiKey) {
      // Log available Constants paths for debugging
      console.log(`[Gemini] Constants.expoConfig?.extra keys:`, Object.keys(Constants.expoConfig?.extra ?? {}));
      throw new Error(
        'AI servisi şu an kullanılamıyor. Lütfen uygulamayı yeniden başlatın.'
      );
    }
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API anahtarı ayarlanmadı. Önce initialize() çağrılmalıdır.');
    }

    // Throttle
    const now = Date.now();
    const elapsed = now - this.lastCallTime;
    if (elapsed < THROTTLE_MS) {
      await sleep(THROTTLE_MS - elapsed);
    }

    this.lastCallTime = Date.now();

    const url = `${GEMINI_API_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const contents: GeminiContent[] = [
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
      },
    };

    if (systemPrompt) {
      body.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log(`[Gemini] status=${response.status} model=${this.model}`);

      if (response.status === 429) {
        console.log(`[Gemini] 429 rate limited — no retry, throwing immediately`);
        throw new Error(
          'Gemini API hız limiti aşıldı. Lütfen 1 dakika bekleyip tekrar deneyin.'
        );
      }

      if (!response.ok) {
        const errorData: GeminiResponse = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        console.log(`[Gemini] error: ${errorMsg}`);

        if (response.status === 400 && errorMsg.includes('API key')) {
          throw new Error('Gemini API anahtarı geçersiz. Ayarlar\'dan kontrol edin.');
        }
        throw new Error(`Gemini API hatası: ${errorMsg}`);
      }

      const data: GeminiResponse = await response.json();
      console.log(`[Gemini] success, tokens=${data.usageMetadata?.totalTokenCount}`);

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini API boş yanıt döndü.');
      }

      return text;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Gemini API ile iletişim kesildi. İnternet bağlantınızı kontrol edin.'
        );
      }
      throw error;
    }
  }

  async release(): Promise<void> {
    // Cloud API için temizlik işlemi gerekmiyor
  }
}
