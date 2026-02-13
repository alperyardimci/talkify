import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisState, ChatStatistics, AnalysisResult } from '@/src/types';

interface AnalysisActions {
  setStatistics: (statistics: ChatStatistics | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AnalysisState = {
  statistics: null,
  analysisResult: null,
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,
};

export const useAnalysisStore = create<AnalysisState & AnalysisActions>()(
  persist(
    (set) => ({
      ...initialState,

      setStatistics: (statistics) => set({ statistics, error: null }),
      setAnalysisResult: (result) => set({ analysisResult: result, error: null }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
      setError: (error) => set({ error, isAnalyzing: false }),
      reset: () => set(initialState),
    }),
    {
      name: 'talkify-analysis',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ analysisResult: state.analysisResult }),
    },
  ),
);
