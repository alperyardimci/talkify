import { useCallback } from 'react';
import { useChatStore, useAnalysisStore, useSettingsStore, useLLMStore } from '@/src/stores';
import { createLLMProvider } from '@/src/services/llm/llmProvider';
import { getSystemPrompt, getParticipantAnalysisPrompt, getGroupAnalysisPrompt, getReviewPrompt } from '@/src/services/llm/promptTemplates';
import { parseParticipantResponse, parseGroupResponse } from '@/src/services/llm/responseParser';
import { prepareParticipantContext } from '@/src/services/llm/chunkStrategy';
import { calculateStatistics } from '@/src/services/analytics/statisticsEngine';
import { detectBehaviorPatterns } from '@/src/services/analytics/behaviorPatterns';
import type { ParticipantAnalysis, AnalysisResult, LLMProvider } from '@/src/types';

/**
 * Yanıtta Türkçe dışı kelimeler varsa tespit eder.
 * Latin harfleri + Türkçe özel karakterler dışında CJK, Arapça vb. karakter blokları arar.
 * Ayrıca yaygın İngilizce kelimeleri kontrol eder.
 */
function containsNonTurkish(text: string): boolean {
  // CJK, Arapça, Kiril vb. karakter blokları
  if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u0400-\u04ff\u0600-\u06ff\u0750-\u077f\ufb50-\ufdff\ufe70-\ufeff]/.test(text)) {
    return true;
  }
  // Yaygın İngilizce kelimeler (etiket satırları hariç içerikte)
  const contentOnly = text
    .replace(/^(LAKAP|KİŞİLİK|DEDİKODU|UYARI|ÖZET|DİNAMİK|EĞLENCE)\s*:/gm, '')
    .toLowerCase();
  const englishWords = /\b(the|this|that|with|from|have|has|been|will|would|could|should|they|their|them|what|which|where|when|energy|vibe|like|basically|literally|actually|really|ghost|king|queen|boss|master|level|power|mode)\b/i;
  return englishWords.test(contentOnly);
}

/**
 * LLM yanıtını kontrol eder, Türkçe dışı kelime varsa düzeltme isteği gönderir.
 */
async function ensureTurkish(
  response: string,
  provider: LLMProvider,
  systemPrompt: string
): Promise<string> {
  if (!containsNonTurkish(response)) {
    return response;
  }
  const reviewPrompt = getReviewPrompt(response);
  const reviewed = await provider.complete(reviewPrompt, systemPrompt);
  return reviewed;
}

export function useLLMAnalysis() {
  const currentChat = useChatStore((s) => s.currentChat);
  const llmConfig = useSettingsStore((s) => s.llmConfig);
  const { setIsAnalyzing, setAnalysisProgress, setAnalysisResult, setError } = useAnalysisStore();
  const { setGenerating } = useLLMStore();

  const runAnalysis = useCallback(async () => {
    if (!currentChat) {
      setError('Önce bir sohbet dosyası yükleyin');
      return;
    }

    try {
      setAnalysisResult(null);
      setIsAnalyzing(true);
      setGenerating(true);
      setAnalysisProgress(5);
      setError(null);

      // Calculate statistics
      const statistics = calculateStatistics(currentChat);
      setAnalysisProgress(10);

      // Create LLM provider
      const provider = createLLMProvider(llmConfig.provider);
      await provider.initialize(llmConfig);
      setAnalysisProgress(15);

      const systemPrompt = getSystemPrompt();
      const participantAnalyses: ParticipantAnalysis[] = [];
      const totalParticipants = statistics.participantStats.length;

      // Analyze each participant
      for (let i = 0; i < totalParticipants; i++) {
        const pStats = statistics.participantStats[i];
        const patterns = detectBehaviorPatterns(pStats, statistics.participantStats);

        // Get messages for this participant
        const participantMessages = currentChat.messages.filter(
          (m) => m.sender === pStats.name && m.type === 'text'
        );

        const { sampleMessages } = prepareParticipantContext(
          pStats,
          participantMessages,
          patterns
        );

        const prompt = getParticipantAnalysisPrompt(
          pStats.name,
          pStats,
          sampleMessages,
          patterns
        );

        const rawResponse = await provider.complete(prompt, systemPrompt);
        const response = await ensureTurkish(rawResponse, provider, systemPrompt);
        const parsed = parseParticipantResponse(response);

        participantAnalyses.push({
          participantId: pStats.participantId,
          name: pStats.name,
          nickname: parsed.nickname,
          personality: parsed.personality,
          gossip: parsed.gossip,
          warning: parsed.warning,
          behaviorPatterns: patterns,
        });

        const progress = 15 + ((i + 1) / totalParticipants) * 70;
        setAnalysisProgress(Math.round(progress));
      }

      // Group analysis
      setAnalysisProgress(90);
      const participantSummaries = participantAnalyses.map(
        (pa) => `${pa.name} (Lakap: ${pa.nickname}): ${pa.personality}`
      );

      const startStr = currentChat.startDate.toLocaleDateString('tr-TR');
      const endStr = currentChat.endDate.toLocaleDateString('tr-TR');
      const groupPrompt = getGroupAnalysisPrompt(participantSummaries, {
        totalMessages: currentChat.totalMessages,
        dateRange: `${startStr} - ${endStr}`,
        participantCount: totalParticipants,
      });

      const rawGroupResponse = await provider.complete(groupPrompt, systemPrompt);
      const groupResponse = await ensureTurkish(rawGroupResponse, provider, systemPrompt);
      const groupParsed = parseGroupResponse(groupResponse);

      await provider.release();

      const result: AnalysisResult = {
        chatId: currentChat.chatName,
        timestamp: new Date(),
        participants: participantAnalyses,
        group: {
          summary: groupParsed.summary,
          dynamics: groupParsed.dynamics,
          funFacts: groupParsed.funFacts,
        },
        isComplete: true,
      };

      setAnalysisResult(result);
      setAnalysisProgress(100);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Analiz sırasında bir hata oluştu';
      setError(message);
    } finally {
      setIsAnalyzing(false);
      setGenerating(false);
    }
  }, [
    currentChat,
    llmConfig,
    setIsAnalyzing,
    setGenerating,
    setAnalysisProgress,
    setAnalysisResult,
    setError,
  ]);

  return { runAnalysis };
}
