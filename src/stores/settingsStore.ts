import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SettingsState, LLMConfig } from '@/src/types';

interface SettingsActions {
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
}

const initialState: SettingsState = {
  llmConfig: {
    provider: 'groq',
    groqApiKey: '',
    groqModel: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    maxTokens: 1024,
  },
  language: 'tr',
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,

      updateLLMConfig: (config) =>
        set((state) => ({
          llmConfig: { ...state.llmConfig, ...config },
        })),
    }),
    {
      name: 'talkify-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
