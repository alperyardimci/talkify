import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SettingsState, LLMConfig, Language } from '@/src/types';

interface SettingsActions {
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  setLanguage: (language: Language) => void;
  setTimezoneOffset: (offset: number) => void;
}

const initialState: SettingsState = {
  llmConfig: {
    provider: 'gemini',
    groqApiKey: '',
    groqModel: 'llama-3.3-70b-versatile',
    geminiApiKey: '',
    geminiModel: 'gemini-2.0-flash',
    temperature: 0.8,
    maxTokens: 4096,
  },
  language: 'tr',
  timezoneOffset: 3,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,

      updateLLMConfig: (config) =>
        set((state) => ({
          llmConfig: { ...state.llmConfig, ...config },
        })),

      setLanguage: (language) => set({ language }),

      setTimezoneOffset: (timezoneOffset) => set({ timezoneOffset }),
    }),
    {
      name: 'talkify-settings',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as object) } as SettingsState & SettingsActions;
        // Always force Gemini provider and adequate token limit
        merged.llmConfig = { ...initialState.llmConfig, ...merged.llmConfig, provider: 'gemini', maxTokens: 4096 };
        return merged;
      },
    },
  ),
);
