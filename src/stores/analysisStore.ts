import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisState, ChatStatistics, AnalysisResult, AnalysisMode } from '@/src/types';

interface AnalysisActions {
  setStatistics: (statistics: ChatStatistics | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setAnalysisStatus: (status: string | null) => void;
  setSelectedMode: (mode: AnalysisMode) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AnalysisState = {
  statistics: null,
  analysisResult: null,
  isAnalyzing: false,
  analysisProgress: 0,
  analysisStatus: null,
  selectedMode: 'falci_teyze',
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
      setAnalysisStatus: (status) => set({ analysisStatus: status }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),
      setError: (error) => set(error ? { error, isAnalyzing: false } : { error }),
      reset: () => set(initialState),
    }),
    {
      name: 'talkify-analysis',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        analysisResult: state.analysisResult,
        selectedMode: state.selectedMode,
      }),
    },
  ),
);
