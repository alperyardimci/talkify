// ============================================
// Talkify - LLM Provider Factory
// ============================================

import type { LLMProvider, LLMProviderType } from '@/src/types';
import { GroqProvider } from './groqProvider';

/**
 * Verilen tipe göre uygun LLM provider örneği oluşturur.
 */
export function createLLMProvider(type: LLMProviderType): LLMProvider {
  switch (type) {
    case 'groq':
      return new GroqProvider();
    default: {
      const _exhaustive: never = type;
      throw new Error(`Bilinmeyen LLM provider tipi: ${_exhaustive}`);
    }
  }
}
