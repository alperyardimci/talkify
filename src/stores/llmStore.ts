import { create } from 'zustand';
import type { LLMState } from '@/src/types';

interface LLMActions {
  setConnected: (isConnected: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  setCurrentModel: (model: string | null) => void;
  setAvailableModels: (models: string[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: LLMState = {
  isConnected: false,
  isGenerating: false,
  currentModel: null,
  availableModels: [],
  error: null,
};

export const useLLMStore = create<LLMState & LLMActions>()((set) => ({
  ...initialState,

  setConnected: (isConnected) => set({ isConnected, error: null }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setCurrentModel: (model) => set({ currentModel: model }),
  setAvailableModels: (models) => set({ availableModels: models }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
