// ============================================
// Talkify - Behavior Pattern Detection
// ============================================

import type {
  ParticipantStats,
  BehaviorPattern,
  BehaviorPatternType,
} from '@/src/types';
import { Strings } from '@/src/constants/strings';

// ---- Pattern detector definition ----

interface PatternDetector {
  type: BehaviorPatternType;
  detect: (stats: ParticipantStats, allStats: ParticipantStats[]) => number | null;
}

// ---- Helper: clamp score to 0-100 ----

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// ---- Pattern detectors ----

const patternDetectors: PatternDetector[] = [
  {
    // Gece Kusu - Night owl: high ratio of messages between 00:00-06:00
    type: 'gece_kusu',
    detect: (stats) => {
      if (stats.nightMessageRatio <= 0.15) return null;
      return clamp(stats.nightMessageRatio * 200);
    },
  },
  {
    // Monolog Krali - Monologue king: sends many consecutive messages
    type: 'monolog_krali',
    detect: (stats) => {
      if (stats.consecutiveMessages < 5) return null;
      return clamp(stats.consecutiveMessages * 8);
    },
  },
  {
    // Hayalet - Ghost: very slow response time
    type: 'hayalet',
    detect: (stats) => {
      if (stats.avgResponseTimeMinutes === null) return null;
      if (stats.avgResponseTimeMinutes <= 30) return null;
      return clamp(stats.avgResponseTimeMinutes * 2);
    },
  },
  {
    // Emoji Ustasi - Emoji master: uses a wide variety of emojis
    type: 'emoji_ustasi',
    detect: (stats) => {
      if (stats.uniqueEmojis.length < 20) return null;
      return clamp(stats.uniqueEmojis.length * 2);
    },
  },
  {
    // Sohbet Atesleyici - Conversation starter: frequently starts conversations
    type: 'sohbet_atesleyici',
    detect: (stats, allStats) => {
      const totalStarts = allStats.reduce(
        (sum, s) => sum + s.conversationStartCount,
        0
      );
      if (totalStarts === 0) return null;
      const ratio = stats.conversationStartCount / totalStarts;
      if (ratio <= 0.3) return null;
      return clamp(ratio * 150);
    },
  },
  {
    // Tek Kelimelik - One-word replier: high ratio of single-word messages
    type: 'tek_kelimelik',
    detect: (stats) => {
      if (stats.messageCount === 0) return null;
      const ratio = stats.singleWordCount / stats.messageCount;
      if (ratio <= 0.3) return null;
      return clamp(ratio * 200);
    },
  },
  {
    // Link Bombardimanci - Link bomber: shares many links
    type: 'link_bombardimanci',
    detect: (stats) => {
      if (stats.messageCount === 0) return null;
      const ratio = stats.linkCount / stats.messageCount;
      if (ratio <= 0.1) return null;
      return clamp(ratio * 500);
    },
  },
  {
    // Soru Makinesi - Question machine: asks many questions
    type: 'soru_makinesi',
    detect: (stats) => {
      if (stats.messageCount === 0) return null;
      const ratio = stats.questionCount / stats.messageCount;
      if (ratio <= 0.15) return null;
      return clamp(ratio * 300);
    },
  },
  {
    // Roman Yazari - Novel writer: writes long messages on average
    type: 'roman_yazari',
    detect: (stats) => {
      if (stats.avgWordsPerMessage <= 15) return null;
      return clamp(stats.avgWordsPerMessage * 4);
    },
  },
  {
    // Sessiz Okuyucu - Silent reader: in the lowest 20% of activity
    type: 'sessiz_okuyucu',
    detect: (stats, allStats) => {
      if (allStats.length < 2) return null;
      const sorted = [...allStats]
        .map((s) => s.messageCount)
        .sort((a, b) => a - b);
      const threshold = sorted[Math.max(0, Math.ceil(sorted.length * 0.2) - 1)];
      if (stats.messageCount > threshold) return null;
      // Score: inverse of how active they are relative to the most active
      const maxMessages = sorted[sorted.length - 1];
      if (maxMessages === 0) return null;
      const ratio = stats.messageCount / maxMessages;
      return clamp((1 - ratio) * 100);
    },
  },
  {
    // Sabahci - Early bird: many messages between 05:00-09:00
    type: 'sabahci',
    detect: (stats) => {
      if (stats.messageCount === 0) return null;
      const morningCount = stats.hourlyActivity
        .filter((h) => h.hour >= 5 && h.hour <= 8)
        .reduce((sum, h) => sum + h.count, 0);
      const ratio = morningCount / stats.messageCount;
      if (ratio <= 0.25) return null;
      return clamp(ratio * 250);
    },
  },
  {
    // Medya Delisi - Media fanatic: shares many media files
    type: 'medya_delisi',
    detect: (stats) => {
      if (stats.messageCount === 0) return null;
      const ratio = stats.mediaCount / stats.messageCount;
      if (ratio <= 0.15) return null;
      return clamp(ratio * 400);
    },
  },
];

// ---- Build a BehaviorPattern from type and score ----

function buildPattern(type: BehaviorPatternType, score: number): BehaviorPattern {
  return {
    type,
    label: Strings.patterns[type],
    description: Strings.patternDescriptions[type],
    icon: Strings.patternIcons[type],
    score,
  };
}

// ---- Main detection function ----

export function detectBehaviorPatterns(
  stats: ParticipantStats,
  allStats: ParticipantStats[]
): BehaviorPattern[] {
  const patterns: BehaviorPattern[] = [];

  for (const detector of patternDetectors) {
    const score = detector.detect(stats, allStats);
    if (score !== null && score >= 30) {
      patterns.push(buildPattern(detector.type, score));
    }
  }

  // Sort by score descending
  patterns.sort((a, b) => b.score - a.score);

  return patterns;
}
