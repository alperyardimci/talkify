import { useEffect } from 'react';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import { calculateStatistics } from '@/src/services/analytics/statisticsEngine';
import { detectBehaviorPatterns } from '@/src/services/analytics/behaviorPatterns';
import type { ParticipantStats, BehaviorPattern } from '@/src/types';

export function useStatistics() {
  const currentChat = useChatStore((s) => s.currentChat);
  const statistics = useAnalysisStore((s) => s.statistics);
  const setStatistics = useAnalysisStore((s) => s.setStatistics);

  useEffect(() => {
    if (currentChat && !statistics) {
      const stats = calculateStatistics(currentChat);
      setStatistics(stats);
    }
  }, [currentChat, statistics, setStatistics]);

  const recalculate = () => {
    if (currentChat) {
      const stats = calculateStatistics(currentChat);
      setStatistics(stats);
      return stats;
    }
    return null;
  };

  const getPatterns = (
    participantStats: ParticipantStats
  ): BehaviorPattern[] => {
    if (!statistics) return [];
    return detectBehaviorPatterns(participantStats, statistics.participantStats);
  };

  return { statistics, recalculate, getPatterns };
}
