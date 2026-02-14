// ============================================
// Talkify - LLM Provider Factory
// ============================================

import type { LLMProvider, LLMProviderType } from '@/src/types';
import { GroqProvider } from './groqProvider';
import { GeminiProvider } from './geminiProvider';

/**
 * Verilen tipe göre uygun LLM provider örneği oluşturur.
 */
export function createLLMProvider(type: LLMProviderType): LLMProvider {
  switch (type) {
    case 'groq':
      return new GroqProvider();
    case 'gemini':
      return new GeminiProvider();
    default: {
      const _exhaustive: never = type;
      throw new Error(`Bilinmeyen LLM provider tipi: ${_exhaustive}`);
    }
  }
}
