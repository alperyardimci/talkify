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

/** Max retry count for rate-limited requests. */
const MAX_RETRIES = 5;
/** Base delay in ms for exponential backoff. */
const BASE_DELAY_MS = 3000;
/** Minimum delay between consecutive API calls to avoid bursts. */
const THROTTLE_MS = 800;
/** If remaining tokens drop below this, proactively wait for reset. */
const TOKEN_THRESHOLD = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parses Groq rate limit duration strings like "2.605s", "17m16.8s", "185ms".
 * Returns milliseconds.
 */
function parseRateLimitDuration(duration: string): number {
  if (!duration) return 0;
  let totalMs = 0;
  const minMatch = duration.match(/(\d+(?:\.\d+)?)m(?!s)/);
  if (minMatch) totalMs += parseFloat(minMatch[1]) * 60_000;
  const secMatch = duration.match(/(\d+(?:\.\d+)?)s$/);
  if (secMatch) totalMs += parseFloat(secMatch[1]) * 1_000;
  const msMatch = duration.match(/(\d+(?:\.\d+)?)ms/);
  if (msMatch) totalMs += parseFloat(msMatch[1]);
  return totalMs;
}

/**
 * Groq Cloud API üzerinden LLM erişimi sağlayan provider.
 * OpenAI-compatible chat/completions endpoint kullanır.
 * Rate limit (429) durumunda otomatik exponential backoff ile retry yapar.
 */
export class GroqProvider implements LLMProvider {
  readonly type: LLMProviderType = 'groq';

  private apiKey: string = '';
  private model: string = 'llama-3.3-70b-versatile';
  private temperature: number = 0.8;
  private maxTokens: number = 512;
  /** Timestamp of the last API call — used for throttling. */
  private lastCallTime: number = 0;
  /** Optional callback invoked before each retry wait (429 received). */
  onRetry?: (attempt: number, waitMs: number) => void;
  /** Optional callback invoked when proactively waiting for token budget to refill. */
  onWaiting?: (waitMs: number) => void;

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

    // Throttle: ensure minimum gap between consecutive calls
    const now = Date.now();
    const elapsed = now - this.lastCallTime;
    if (elapsed < THROTTLE_MS) {
      await sleep(THROTTLE_MS - elapsed);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        this.lastCallTime = Date.now();

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

        console.log(`[Groq] attempt=${attempt} status=${response.status}`);

        if (response.status === 429) {
          // retry-after (seconds) is the authoritative wait time on 429
          const retryAfter = response.headers.get('retry-after');
          const resetRequests = response.headers.get('x-ratelimit-reset-requests');
          const resetTokens = response.headers.get('x-ratelimit-reset-tokens');

          // Calculate wait from retry-after (seconds), then reset-requests, then reset-tokens, then backoff
          let waitMs: number;
          const retryAfterSec = retryAfter ? Number(retryAfter) : NaN;
          if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) {
            waitMs = retryAfterSec * 1000;
          } else if (resetRequests) {
            waitMs = parseRateLimitDuration(resetRequests) + 500;
          } else if (resetTokens) {
            waitMs = parseRateLimitDuration(resetTokens) + 500;
          } else {
            waitMs = BASE_DELAY_MS * Math.pow(2, attempt);
          }
          if (!Number.isFinite(waitMs) || waitMs <= 0) {
            waitMs = BASE_DELAY_MS * Math.pow(2, attempt);
          }

          console.log(`[Groq] 429 rate limited, retry-after=${retryAfter}, reset-requests=${resetRequests}, reset-tokens=${resetTokens}, calculated wait=${waitMs}ms`);

          // If wait is too long (>30s), don't block — throw with a helpful message
          if (waitMs > 30_000) {
            const waitMin = Math.floor(waitMs / 60_000);
            const waitSec = Math.ceil((waitMs % 60_000) / 1000);
            const timeStr = waitMin > 0 ? `${waitMin} dk ${waitSec} sn` : `${waitSec} saniye`;
            throw new Error(
              `Groq API istek limiti doldu. ${timeStr} sonra tekrar deneyin.`
            );
          }

          if (attempt < MAX_RETRIES) {
            this.onRetry?.(attempt + 1, waitMs);
            await sleep(waitMs);
            continue;
          }
          throw new Error(
            'Groq API hız limiti aşıldı. Lütfen biraz bekleyip tekrar deneyin.'
          );
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Bilinmeyen hata');
          console.log(`[Groq] error status=${response.status} body=${errorText.slice(0, 200)}`);
          if (response.status === 401) {
            throw new Error('Groq API anahtarı geçersiz. Ayarlar\'dan kontrol edin.');
          }
          throw new Error(`Groq API hatası (${response.status}): ${errorText}`);
        }

        const data: GroqChatResponse = await response.json();

        // Read rate limit headers for proactive pacing
        const remainingTokens = parseInt(response.headers.get('x-ratelimit-remaining-tokens') || '99999', 10);
        const resetDuration = response.headers.get('x-ratelimit-reset-tokens') || '';

        console.log(`[Groq] success, used=${data.usage?.total_tokens}, remaining=${remainingTokens}, reset=${resetDuration}`);

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Groq API boş yanıt döndü.');
        }

        // Proactive pacing: if remaining tokens are below threshold, wait for reset
        if (remainingTokens < TOKEN_THRESHOLD && resetDuration) {
          const waitMs = parseRateLimitDuration(resetDuration) + 500;
          if (waitMs > 0 && Number.isFinite(waitMs)) {
            console.log(`[Groq] proactive wait ${waitMs}ms (remaining tokens: ${remainingTokens})`);
            this.onWaiting?.(waitMs);
            await sleep(waitMs);
          }
        }

        return data.choices[0].message.content;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error(
            'Groq API ile iletişim kesildi. İnternet bağlantınızı kontrol edin.'
          );
        }
        lastError = error instanceof Error ? error : new Error(String(error));
        // Only retry on rate limit (handled above via continue), throw everything else
        throw lastError;
      }
    }

    throw lastError ?? new Error('Groq API isteği başarısız oldu.');
  }

  async release(): Promise<void> {
    // Cloud API için temizlik işlemi gerekmiyor
  }
}
