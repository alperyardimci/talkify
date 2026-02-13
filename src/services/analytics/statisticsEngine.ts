// ============================================
// Talkify - Statistics Engine
// ============================================

import type {
  ParsedChat,
  ParsedMessage,
  ChatStatistics,
  ParticipantStats,
  HourlyActivity,
  DailyActivity,
  EmojiUsage,
} from '@/src/types';

// Regex for emoji detection (presentation emojis + text emojis with variant selector)
const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

// Two-hour gap threshold in milliseconds for conversation starts
const CONVERSATION_GAP_MS = 2 * 60 * 60 * 1000;

// ---- Utility helpers ----

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

function extractEmojis(text: string): string[] {
  return Array.from(text.matchAll(EMOJI_REGEX), (m) => m[0]);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function initHourlyArray(): HourlyActivity[] {
  return Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
}

function initDailyArray(): DailyActivity[] {
  return Array.from({ length: 7 }, (_, i) => ({ day: i, count: 0 }));
}

// ---- Per-participant accumulator ----

interface ParticipantAccumulator {
  participantId: string;
  name: string;
  messageCount: number;
  wordCount: number;
  emojiCount: number;
  emojiMap: Map<string, number>;
  mediaCount: number;
  linkCount: number;
  deletedCount: number;
  hourly: number[];
  daily: number[];
  textLengths: { content: string; length: number }[];
  questionCount: number;
  singleWordCount: number;
  nightMessageCount: number;
  firstMessageDate: Date | null;
  lastMessageDate: Date | null;
}

function createAccumulator(id: string, name: string): ParticipantAccumulator {
  return {
    participantId: id,
    name,
    messageCount: 0,
    wordCount: 0,
    emojiCount: 0,
    emojiMap: new Map(),
    mediaCount: 0,
    linkCount: 0,
    deletedCount: 0,
    hourly: new Array(24).fill(0),
    daily: new Array(7).fill(0),
    textLengths: [],
    questionCount: 0,
    singleWordCount: 0,
    nightMessageCount: 0,
    firstMessageDate: null,
    lastMessageDate: null,
  };
}

// ---- Main calculation function ----

export function calculateStatistics(chat: ParsedChat): ChatStatistics {
  const { messages, participants } = chat;

  // Build accumulators keyed by participant name
  const accumulators = new Map<string, ParticipantAccumulator>();
  for (const p of participants) {
    accumulators.set(p.name, createAccumulator(p.id, p.name));
  }

  // Aggregate hourly/daily for the overall chat
  const overallHourly = new Array(24).fill(0);
  const overallDaily = new Array(7).fill(0);
  const dayCountMap = new Map<string, number>();

  // For response time calculation: track sender transitions
  // Each entry: { sender, timeDiffMinutes }
  const responseGaps = new Map<string, number[]>();
  for (const p of participants) {
    responseGaps.set(p.name, []);
  }

  // For consecutive message streaks
  const maxConsecutive = new Map<string, number>();
  for (const p of participants) {
    maxConsecutive.set(p.name, 0);
  }

  // For conversation start counts
  const conversationStarts = new Map<string, number>();
  for (const p of participants) {
    conversationStarts.set(p.name, 0);
  }

  let currentStreakSender: string | null = null;
  let currentStreakCount = 0;
  let prevSender: string | null = null;
  let prevTimestamp: Date | null = null;

  // ---- Single pass over all messages ----
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    // Skip system messages entirely
    if (msg.type === 'system') continue;

    const acc = accumulators.get(msg.sender);
    if (!acc) continue;

    const hour = msg.timestamp.getHours();
    const day = msg.timestamp.getDay();
    const dateKey = formatDateKey(msg.timestamp);

    // Count per-participant
    acc.messageCount++;
    acc.hourly[hour]++;
    acc.daily[day]++;

    // Overall aggregates
    overallHourly[hour]++;
    overallDaily[day]++;
    dayCountMap.set(dateKey, (dayCountMap.get(dateKey) ?? 0) + 1);

    // Date tracking
    if (!acc.firstMessageDate || msg.timestamp < acc.firstMessageDate) {
      acc.firstMessageDate = msg.timestamp;
    }
    if (!acc.lastMessageDate || msg.timestamp > acc.lastMessageDate) {
      acc.lastMessageDate = msg.timestamp;
    }

    // Night messages (00:00 - 05:59)
    if (hour >= 0 && hour < 6) {
      acc.nightMessageCount++;
    }

    // Type-specific counts
    switch (msg.type) {
      case 'media':
        acc.mediaCount++;
        break;
      case 'link':
        acc.linkCount++;
        // Links can also contain words and emojis, fall through logic below
        break;
      case 'deleted':
        acc.deletedCount++;
        break;
      case 'text':
        break;
    }

    // Word and emoji counts (for text and link messages)
    if (msg.type === 'text' || msg.type === 'link') {
      const words = countWords(msg.content);
      acc.wordCount += words;

      const emojis = extractEmojis(msg.content);
      acc.emojiCount += emojis.length;
      for (const emoji of emojis) {
        acc.emojiMap.set(emoji, (acc.emojiMap.get(emoji) ?? 0) + 1);
      }

      // Track text lengths for longest/shortest (text messages only)
      if (msg.type === 'text') {
        acc.textLengths.push({ content: msg.content, length: msg.content.length });
      }

      // Question detection
      if (msg.content.trimEnd().endsWith('?')) {
        acc.questionCount++;
      }

      // Single word detection
      if (words === 1) {
        acc.singleWordCount++;
      }
    }

    // ---- Consecutive messages ----
    if (msg.sender === currentStreakSender) {
      currentStreakCount++;
    } else {
      // Finalize previous streak
      if (currentStreakSender !== null) {
        const prev = maxConsecutive.get(currentStreakSender) ?? 0;
        if (currentStreakCount > prev) {
          maxConsecutive.set(currentStreakSender, currentStreakCount);
        }
      }
      currentStreakSender = msg.sender;
      currentStreakCount = 1;
    }

    // ---- Response time (sender transition) ----
    if (prevSender !== null && prevTimestamp !== null && msg.sender !== prevSender) {
      const diffMs = msg.timestamp.getTime() - prevTimestamp.getTime();
      const diffMin = diffMs / (1000 * 60);
      // Only count reasonable response times (positive and within 24 hours)
      if (diffMin > 0 && diffMin <= 1440) {
        responseGaps.get(msg.sender)!.push(diffMin);
      }
    }

    // ---- Conversation starts (first message after 2+ hour gap) ----
    if (prevTimestamp !== null) {
      const gap = msg.timestamp.getTime() - prevTimestamp.getTime();
      if (gap >= CONVERSATION_GAP_MS) {
        conversationStarts.set(
          msg.sender,
          (conversationStarts.get(msg.sender) ?? 0) + 1
        );
      }
    } else {
      // Very first message of the chat is a conversation start
      conversationStarts.set(
        msg.sender,
        (conversationStarts.get(msg.sender) ?? 0) + 1
      );
    }

    prevSender = msg.sender;
    prevTimestamp = msg.timestamp;
  }

  // Finalize last consecutive streak
  if (currentStreakSender !== null) {
    const prev = maxConsecutive.get(currentStreakSender) ?? 0;
    if (currentStreakCount > prev) {
      maxConsecutive.set(currentStreakSender, currentStreakCount);
    }
  }

  // ---- Build participant stats ----
  const participantStats: ParticipantStats[] = [];

  for (const [, acc] of accumulators) {
    // Unique emojis sorted by count desc, top 20
    const uniqueEmojis: EmojiUsage[] = Array.from(acc.emojiMap.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Hourly and daily activity arrays
    const hourlyActivity: HourlyActivity[] = acc.hourly.map((count, hour) => ({
      hour,
      count,
    }));
    const dailyActivity: DailyActivity[] = acc.daily.map((count, day) => ({
      day,
      count,
    }));

    // Response time median
    const gaps = responseGaps.get(acc.name) ?? [];
    const avgResponseTimeMinutes =
      gaps.length >= 5 ? Math.round(median(gaps) * 100) / 100 : null;

    // Longest and shortest text messages
    let longestMessage = '';
    let shortestMessage = '';
    if (acc.textLengths.length > 0) {
      acc.textLengths.sort((a, b) => b.length - a.length);
      longestMessage = acc.textLengths[0].content;
      shortestMessage = acc.textLengths[acc.textLengths.length - 1].content;
    }

    // Night message ratio
    const nightMessageRatio =
      acc.messageCount > 0 ? acc.nightMessageCount / acc.messageCount : 0;

    const stats: ParticipantStats = {
      participantId: acc.participantId,
      name: acc.name,
      messageCount: acc.messageCount,
      wordCount: acc.wordCount,
      avgWordsPerMessage:
        acc.messageCount > 0
          ? Math.round((acc.wordCount / acc.messageCount) * 100) / 100
          : 0,
      emojiCount: acc.emojiCount,
      uniqueEmojis,
      mediaCount: acc.mediaCount,
      linkCount: acc.linkCount,
      deletedCount: acc.deletedCount,
      hourlyActivity,
      dailyActivity,
      avgResponseTimeMinutes,
      longestMessage,
      shortestMessage,
      firstMessageDate: acc.firstMessageDate ?? chat.startDate,
      lastMessageDate: acc.lastMessageDate ?? chat.endDate,
      questionCount: acc.questionCount,
      singleWordCount: acc.singleWordCount,
      consecutiveMessages: maxConsecutive.get(acc.name) ?? 0,
      nightMessageRatio: Math.round(nightMessageRatio * 10000) / 10000,
      conversationStartCount: conversationStarts.get(acc.name) ?? 0,
    };

    participantStats.push(stats);
  }

  // Filter out participants with no counted messages (e.g. group title / system entities)
  const filteredStats = participantStats.filter((p) => p.messageCount > 0);

  // ---- Overall stats ----
  const totalMessages = filteredStats.reduce((s, p) => s + p.messageCount, 0);
  const totalWords = filteredStats.reduce((s, p) => s + p.wordCount, 0);
  const totalEmojis = filteredStats.reduce((s, p) => s + p.emojiCount, 0);
  const totalMedia = filteredStats.reduce((s, p) => s + p.mediaCount, 0);
  const totalLinks = filteredStats.reduce((s, p) => s + p.linkCount, 0);
  const totalDeleted = filteredStats.reduce((s, p) => s + p.deletedCount, 0);

  // Aggregate hourly/daily heatmaps
  const hourlyHeatmap: HourlyActivity[] = overallHourly.map((count, hour) => ({
    hour,
    count,
  }));
  const dailyHeatmap: DailyActivity[] = overallDaily.map((count, day) => ({
    day,
    count,
  }));

  // Most active day
  let mostActiveDayKey = '';
  let mostActiveDayCount = 0;
  for (const [dateKey, count] of dayCountMap) {
    if (count > mostActiveDayCount) {
      mostActiveDayCount = count;
      mostActiveDayKey = dateKey;
    }
  }

  // Most active hour
  let mostActiveHourVal = 0;
  let mostActiveHourCount = 0;
  for (let h = 0; h < 24; h++) {
    if (overallHourly[h] > mostActiveHourCount) {
      mostActiveHourCount = overallHourly[h];
      mostActiveHourVal = h;
    }
  }

  // Aggregate top emojis across all participants from accumulators
  const aggregatedEmojiMap = new Map<string, number>();
  for (const [, acc] of accumulators) {
    for (const [emoji, count] of acc.emojiMap) {
      aggregatedEmojiMap.set(emoji, (aggregatedEmojiMap.get(emoji) ?? 0) + count);
    }
  }
  const topEmojis: EmojiUsage[] = Array.from(aggregatedEmojiMap.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    totalMessages,
    totalWords,
    totalEmojis,
    totalMedia,
    totalLinks,
    totalDeleted,
    dateRange: { start: chat.startDate, end: chat.endDate },
    participantStats: filteredStats,
    hourlyHeatmap,
    dailyHeatmap,
    mostActiveDay: { date: mostActiveDayKey, count: mostActiveDayCount },
    mostActiveHour: { hour: mostActiveHourVal, count: mostActiveHourCount },
    topEmojis,
  };
}
