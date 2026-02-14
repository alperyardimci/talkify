import { useCallback } from 'react';
import { useChatStore, useAnalysisStore, useSettingsStore, useLLMStore } from '@/src/stores';
import { calculateStatistics } from '@/src/services/analytics/statisticsEngine';
import { detectBehaviorPatterns } from '@/src/services/analytics/behaviorPatterns';
import { runLocalAnalysis } from '@/src/services/analytics/localAnalysis';
import type { ParticipantAnalysis, AnalysisResult } from '@/src/types';

export function useLLMAnalysis() {
  const currentChat = useChatStore((s) => s.currentChat);
  const language = useSettingsStore((s) => s.language);
  const selectedMode = useAnalysisStore((s) => s.selectedMode);
  const { setIsAnalyzing, setAnalysisProgress, setAnalysisStatus, setAnalysisResult, setError } = useAnalysisStore();
  const { setGenerating } = useLLMStore();

  const runAnalysis = useCallback(async () => {
    if (useAnalysisStore.getState().isAnalyzing) return;
    setIsAnalyzing(true);

    if (!currentChat) {
      setError(language === 'tr' ? 'Önce bir sohbet dosyası yükleyin' : 'Please load a chat file first');
      return;
    }

    try {
      setAnalysisResult(null);
      setGenerating(true);
      setAnalysisProgress(10);
      setAnalysisStatus(
        language === 'tr' ? 'İstatistikler hesaplanıyor...' : 'Calculating statistics...'
      );

      const statistics = calculateStatistics(currentChat);
      setAnalysisProgress(40);

      setAnalysisStatus(
        language === 'tr' ? 'Davranış kalıpları analiz ediliyor...' : 'Analyzing behavior patterns...'
      );

      // Detect patterns for all participants
      const allPatterns = statistics.participantStats.map((pStats) =>
        detectBehaviorPatterns(pStats, statistics.participantStats, language)
      );

      setAnalysisProgress(60);
      setAnalysisStatus(
        language === 'tr' ? 'Sonuçlar üretiliyor...' : 'Generating results...'
      );

      // Run local analysis — no API call needed (mode-aware)
      const localResult = runLocalAnalysis(statistics.participantStats, allPatterns, language, selectedMode);

      setAnalysisProgress(90);

      const participantAnalyses: ParticipantAnalysis[] = statistics.participantStats.map((pStats, i) => ({
        participantId: pStats.participantId,
        name: pStats.name,
        nickname: localResult.participants[i].nickname,
        personality: localResult.participants[i].personality,
        gossip: localResult.participants[i].gossip,
        warning: localResult.participants[i].warning,
        behaviorPatterns: allPatterns[i],
      }));

      const result: AnalysisResult = {
        chatId: currentChat.chatName,
        timestamp: new Date(),
        participants: participantAnalyses,
        group: {
          summary: localResult.group.summary,
          dynamics: localResult.group.dynamics,
          funFacts: localResult.group.funFacts,
        },
        isComplete: true,
      };

      setAnalysisResult(result);
      setAnalysisProgress(100);
      setAnalysisStatus(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : (language === 'tr' ? 'Analiz sırasında bir hata oluştu' : 'An error occurred during analysis');
      setError(message);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus(null);
      setGenerating(false);
    }
  }, [
    currentChat,
    language,
    selectedMode,
    setIsAnalyzing,
    setGenerating,
    setAnalysisProgress,
    setAnalysisStatus,
    setAnalysisResult,
    setError,
  ]);

  return { runAnalysis };
}
