// ============================================
// Talkify - AI-Free Local Analysis Engine
// ============================================
// Generates nicknames, personality, gossip, and warnings
// using behavioral patterns and statistics — no LLM needed.
// Mode-aware: each analysis mode produces different tone/style.

import type { ParticipantStats, BehaviorPattern, Language, HourlyActivity, AnalysisMode } from '@/src/types';
import {
  NICKNAME_MAP,
  WARNING_MAP,
  STAT_NICKNAMES,
  PERSONALITY_PREFIX,
  GOSSIP_PREFIX,
  GROUP_SUMMARY_PREFIX,
} from './modeTemplates';

/** Find the peak hour from hourly activity */
function getPeakHour(hourly: HourlyActivity[]): number {
  if (hourly.length === 0) return 12;
  return hourly.reduce((max, h) => (h.count > max.count ? h : max), hourly[0]).hour;
}

/** Combine hourly activity arrays from multiple participants */
function combineHourly(allHourly: HourlyActivity[][]): HourlyActivity[] {
  const combined = new Map<number, number>();
  for (const hourly of allHourly) {
    for (const h of hourly) {
      combined.set(h.hour, (combined.get(h.hour) ?? 0) + h.count);
    }
  }
  return Array.from(combined.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour - b.hour);
}

interface ParticipantLocalAnalysis {
  nickname: string;
  personality: string;
  gossip: string;
  warning: string;
}

interface GroupLocalAnalysis {
  summary: string;
  dynamics: string;
  funFacts: string[];
}

// ---- Stat-based fallback nicknames (mode-aware) ----

function getStatBasedNickname(stats: ParticipantStats, allStats: ParticipantStats[], lang: Language, mode: AnalysisMode): string {
  const maxMsgs = Math.max(...allStats.map((s) => s.messageCount));
  const minMsgs = Math.min(...allStats.map((s) => s.messageCount));
  const fallbacks = STAT_NICKNAMES[mode];

  if (stats.messageCount === maxMsgs) {
    const f = fallbacks.find((r) => r.condition === 'most_messages');
    if (f) return f[lang];
  }
  if (stats.messageCount === minMsgs) {
    const f = fallbacks.find((r) => r.condition === 'least_messages');
    if (f) return f[lang];
  }
  if (stats.emojiCount > stats.messageCount * 0.5) {
    const f = fallbacks.find((r) => r.condition === 'high_emoji');
    if (f) return f[lang];
  }
  if (stats.questionCount > stats.messageCount * 0.2) {
    const f = fallbacks.find((r) => r.condition === 'high_question');
    if (f) return f[lang];
  }
  if (stats.avgWordsPerMessage > 10) {
    const f = fallbacks.find((r) => r.condition === 'high_avg_words');
    if (f) return f[lang];
  }
  const def = fallbacks.find((r) => r.condition === 'default');
  return def ? def[lang] : (lang === 'tr' ? 'Sohbetin Tuzu' : 'Chat Regular');
}

// ---- Personality Generation (mode-aware) ----

function generatePersonality(stats: ParticipantStats, patterns: BehaviorPattern[], allStats: ParticipantStats[], lang: Language, mode: AnalysisMode): string {
  const activePatterns = patterns.filter((p) => p.score >= 30).sort((a, b) => b.score - a.score);
  const totalMessages = allStats.reduce((sum, s) => sum + s.messageCount, 0);
  const sharePercent = Math.round((stats.messageCount / totalMessages) * 100);

  const prefix = PERSONALITY_PREFIX[mode][lang];
  const traits: string[] = [];

  if (lang === 'tr') {
    if (sharePercent > 25) {
      traits.push('grubun en aktif üyesi, sohbetsiz duramıyor');
    } else if (sharePercent > 15) {
      traits.push('grubun vazgeçilmez üyelerinden, düzenli yazıyor');
    } else if (sharePercent < 5) {
      traits.push('grubun sessiz üyesi, ama yazdığında etkili');
    }

    if (stats.avgWordsPerMessage > 15) {
      traits.push('uzun ve detaylı mesajlar yazıyor');
    } else if (stats.avgWordsPerMessage < 3) {
      traits.push('kısa ve öz yazıyor, lafı dolandırmıyor');
    }

    if (stats.nightMessageRatio > 0.3) {
      traits.push('geceleri en aktif olduğu zaman');
    } else if (activePatterns.some((p) => p.type === 'sabahci')) {
      traits.push('sabahın erken saatlerinde aktif');
    }

    if (activePatterns.some((p) => p.type === 'sohbet_atesleyici')) {
      traits.push('konuşmaları başlatan kişi, grubu canlı tutuyor');
    }
    if (activePatterns.some((p) => p.type === 'monolog_krali')) {
      traits.push('bazen art arda mesaj yağdırıyor');
    }
    if (activePatterns.some((p) => p.type === 'hayalet')) {
      traits.push('cevap vermesi zaman alıyor ama sonunda geliyor');
    }
    if (activePatterns.some((p) => p.type === 'emoji_ustasi')) {
      traits.push('emojilerle kendini ifade etmeyi çok seviyor');
    }
    if (activePatterns.some((p) => p.type === 'soru_makinesi')) {
      traits.push('sürekli soru sorarak sohbeti yönlendiriyor');
    }
  } else {
    if (sharePercent > 25) {
      traits.push('the most active member, can\'t stop chatting');
    } else if (sharePercent > 15) {
      traits.push('a core member of the group, writes regularly');
    } else if (sharePercent < 5) {
      traits.push('the quiet one, but impactful when they write');
    }

    if (stats.avgWordsPerMessage > 15) {
      traits.push('writes long, detailed messages');
    } else if (stats.avgWordsPerMessage < 3) {
      traits.push('keeps it short and to the point');
    }

    if (stats.nightMessageRatio > 0.3) {
      traits.push('most active at night');
    }
    if (activePatterns.some((p) => p.type === 'sohbet_atesleyici')) {
      traits.push('the one who starts conversations');
    }
    if (activePatterns.some((p) => p.type === 'monolog_krali')) {
      traits.push('sometimes floods the chat with consecutive messages');
    }
    if (activePatterns.some((p) => p.type === 'emoji_ustasi')) {
      traits.push('loves expressing through emojis');
    }
  }

  const selected = traits.slice(0, 2);
  if (selected.length === 0) {
    return lang === 'tr'
      ? `${prefix}grupta %${sharePercent} pay ile dengeli bir katılımcı.`
      : `${prefix}a balanced participant with ${sharePercent}% share of messages.`;
  }

  return prefix + selected[0] + '. ' +
    (selected[1] ? selected[1].charAt(0).toUpperCase() + selected[1].slice(1) + '.' : '');
}

// ---- Gossip Generation (mode-aware) ----

function generateGossip(stats: ParticipantStats, patterns: BehaviorPattern[], allStats: ParticipantStats[], lang: Language, mode: AnalysisMode): string {
  const gossipPrefix = GOSSIP_PREFIX[mode][lang];
  const gossips: string[] = [];

  if (lang === 'tr') {
    if (stats.deletedCount > 5) {
      gossips.push(`${stats.deletedCount} mesaj silmiş. Acaba ne yazıp pişman oldu?`);
    }
    if (stats.consecutiveMessages > 10) {
      gossips.push(`Art arda ${stats.consecutiveMessages} mesaj atmış. Kimse cevap vermeyince kendi kendine sohbet etmiş.`);
    }
    if (stats.nightMessageRatio > 0.4) {
      gossips.push(`Mesajlarının %${Math.round(stats.nightMessageRatio * 100)}'i gece yazılmış. Uyku nedir bilmiyor.`);
    }
    if (stats.singleWordCount > stats.messageCount * 0.4) {
      gossips.push(`Mesajlarının %${Math.round((stats.singleWordCount / stats.messageCount) * 100)}'i tek kelime. Tuşlara basacak enerjisi yok galiba.`);
    }
    if (stats.emojiCount > stats.messageCount) {
      gossips.push(`Mesaj başına ${(stats.emojiCount / stats.messageCount).toFixed(1)} emoji kullanıyor. Duygularını kelimelerle anlatamıyor.`);
    }
    if (stats.questionCount > stats.messageCount * 0.25) {
      gossips.push(`Mesajlarının %${Math.round((stats.questionCount / stats.messageCount) * 100)}'i soru. FBI mülakatına hazırlanıyor olabilir.`);
    }
    if (stats.mediaCount > stats.messageCount * 0.3) {
      gossips.push(`Mesajlarının %${Math.round((stats.mediaCount / stats.messageCount) * 100)}'i medya. Galeri müdürü müsün?`);
    }
    if (stats.avgResponseTimeMinutes != null && stats.avgResponseTimeMinutes > 60) {
      gossips.push(`Ortalama ${Math.round(stats.avgResponseTimeMinutes)} dakikada cevap veriyor. Güvercin postası daha hızlı.`);
    }
    if (stats.avgResponseTimeMinutes != null && stats.avgResponseTimeMinutes < 2) {
      gossips.push(`Ortalama ${Math.round(stats.avgResponseTimeMinutes)} dakikada cevap veriyor. Telefonunu elinden bırakmıyor.`);
    }
    if (stats.linkCount > 20) {
      gossips.push(`${stats.linkCount} link paylaşmış. Grubun resmi internet tarayıcısı.`);
    }

    const peakHour = getPeakHour(stats.hourlyActivity);
    if (peakHour >= 0 && peakHour <= 5) {
      gossips.push(`En aktif olduğu saat gece ${peakHour}:00. Normal insanlar o saatte uyur.`);
    } else if (peakHour >= 22) {
      gossips.push(`Saat ${peakHour}:00'da mesaj rekorunu kırıyor. Yatmadan önce son muhabbetçi.`);
    }
  } else {
    if (stats.deletedCount > 5) {
      gossips.push(`Deleted ${stats.deletedCount} messages. What were they hiding?`);
    }
    if (stats.consecutiveMessages > 10) {
      gossips.push(`Sent ${stats.consecutiveMessages} messages in a row. Had a full conversation alone.`);
    }
    if (stats.nightMessageRatio > 0.4) {
      gossips.push(`${Math.round(stats.nightMessageRatio * 100)}% of messages sent at night. Sleep is clearly optional.`);
    }
    if (stats.emojiCount > stats.messageCount) {
      gossips.push(`Uses ${(stats.emojiCount / stats.messageCount).toFixed(1)} emojis per message. Words are overrated.`);
    }
    if (stats.avgResponseTimeMinutes != null && stats.avgResponseTimeMinutes > 60) {
      gossips.push(`Takes ${Math.round(stats.avgResponseTimeMinutes)} minutes to reply. Carrier pigeon would be faster.`);
    }
    if (stats.avgResponseTimeMinutes != null && stats.avgResponseTimeMinutes < 2) {
      gossips.push(`Replies in ${Math.round(stats.avgResponseTimeMinutes)} minutes. Phone is permanently attached.`);
    }
  }

  if (gossips.length === 0) {
    return lang === 'tr'
      ? `${gossipPrefix}${stats.messageCount} mesaj ile grubun düzenli üyesi. Çok normal, şüpheli derecede normal.`
      : `${gossipPrefix}A regular with ${stats.messageCount} messages. Suspiciously normal.`;
  }

  return gossipPrefix + gossips.slice(0, 2).join(' ');
}

// ---- Warning Generation (mode-aware) ----

function generateWarning(stats: ParticipantStats, patterns: BehaviorPattern[], lang: Language, mode: AnalysisMode): string {
  const top = patterns.filter((p) => p.score >= 50).sort((a, b) => b.score - a.score)[0];
  const modeWarnings = WARNING_MAP[mode];

  if (top && modeWarnings[top.type]) {
    const opts = modeWarnings[top.type][lang];
    if (opts && opts.length > 0) {
      const hash = stats.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return opts[hash % opts.length];
    }
  }

  if (lang === 'tr') {
    if (stats.deletedCount > 10) return 'Çok mesaj siliyor, sırları var bu kişinin.';
    if (stats.consecutiveMessages > 15) return 'Art arda mesaj bombası atabilir, hazırlıklı ol.';
    return 'Normal görünüyor ama herkesin bir gizli tarafı vardır.';
  }

  return 'Seems harmless... for now.';
}

// ---- Group Analysis (mode-aware) ----

function generateGroupAnalysis(allStats: ParticipantStats[], allPatterns: BehaviorPattern[][], lang: Language, mode: AnalysisMode): GroupLocalAnalysis {
  const totalMessages = allStats.reduce((sum, s) => sum + s.messageCount, 0);
  const mostActive = [...allStats].sort((a, b) => b.messageCount - a.messageCount)[0];
  const leastActive = [...allStats].sort((a, b) => a.messageCount - b.messageCount)[0];
  const mostEmoji = [...allStats].sort((a, b) => b.emojiCount - a.emojiCount)[0];
  const nightOwl = [...allStats].sort((a, b) => b.nightMessageRatio - a.nightMessageRatio)[0];
  const fastResponder = [...allStats]
    .filter((s) => s.avgResponseTimeMinutes != null)
    .sort((a, b) => (a.avgResponseTimeMinutes ?? 999) - (b.avgResponseTimeMinutes ?? 999))[0];
  const slowResponder = [...allStats]
    .filter((s) => s.avgResponseTimeMinutes != null)
    .sort((a, b) => (b.avgResponseTimeMinutes ?? 0) - (a.avgResponseTimeMinutes ?? 0))[0];

  const mostActiveShare = Math.round((mostActive.messageCount / totalMessages) * 100);
  const summaryPrefix = GROUP_SUMMARY_PREFIX[mode][lang];

  if (lang === 'tr') {
    const summary = `${summaryPrefix}${allStats.length} kişilik bu grupta toplam ${totalMessages} mesaj paylaşılmış. ${mostActive.name} %${mostActiveShare} pay ile grubun en aktif üyesi, ${leastActive.name} ise en sessiz kişi.`;

    const dynamicsParts: string[] = [];
    if (mostActiveShare > 40) {
      dynamicsParts.push(`${mostActive.name} grubu domine ediyor, neredeyse her konuşmada var`);
    }
    if (fastResponder && slowResponder && fastResponder.name !== slowResponder.name) {
      dynamicsParts.push(`${fastResponder.name} en hızlı cevap veren, ${slowResponder.name} ise cevap vermekte en yavaş`);
    }
    if (nightOwl.nightMessageRatio > 0.2) {
      dynamicsParts.push(`${nightOwl.name} grubun gece vardiyasını tek başına yürütüyor`);
    }

    const dynamics = dynamicsParts.length > 0
      ? dynamicsParts.join('. ') + '.'
      : 'Grup üyeleri dengeli bir şekilde sohbete katılıyor.';

    const funFacts: string[] = [];
    if (mostEmoji.emojiCount > 0) {
      funFacts.push(`${mostEmoji.name} toplamda ${mostEmoji.emojiCount} emoji kullanarak grubun emoji şampiyonu`);
    }

    const totalDeleted = allStats.reduce((sum, s) => sum + s.deletedCount, 0);
    if (totalDeleted > 0) {
      const mostDeleted = [...allStats].sort((a, b) => b.deletedCount - a.deletedCount)[0];
      funFacts.push(`Grupta toplam ${totalDeleted} mesaj silinmiş, en çok silen ${mostDeleted.name}`);
    }

    const totalQuestions = allStats.reduce((sum, s) => sum + s.questionCount, 0);
    if (totalQuestions > 0) {
      funFacts.push(`Grupta toplam ${totalQuestions} soru sorulmuş, merak bitmek bilmiyor`);
    }

    const groupHourly = combineHourly(allStats.map((s) => s.hourlyActivity));
    const groupPeakHour = getPeakHour(groupHourly);
    funFacts.push(`Grubun en aktif saati ${groupPeakHour}:00`);

    return { summary, dynamics, funFacts: funFacts.slice(0, 3) };
  }

  // English
  const summary = `${summaryPrefix}This group of ${allStats.length} people shared ${totalMessages} messages. ${mostActive.name} is the most active with ${mostActiveShare}% of all messages, while ${leastActive.name} is the quietest.`;

  const dynamicsParts: string[] = [];
  if (mostActiveShare > 40) {
    dynamicsParts.push(`${mostActive.name} dominates the group, present in almost every conversation`);
  }
  if (fastResponder && slowResponder && fastResponder.name !== slowResponder.name) {
    dynamicsParts.push(`${fastResponder.name} is the fastest responder, ${slowResponder.name} takes the longest`);
  }
  if (nightOwl.nightMessageRatio > 0.2) {
    dynamicsParts.push(`${nightOwl.name} runs the night shift solo`);
  }

  const dynamics = dynamicsParts.length > 0
    ? dynamicsParts.join('. ') + '.'
    : 'Group members participate in a balanced manner.';

  const funFacts: string[] = [];
  if (mostEmoji.emojiCount > 0) {
    funFacts.push(`${mostEmoji.name} is the emoji champion with ${mostEmoji.emojiCount} total emojis`);
  }
  const totalDeleted = allStats.reduce((sum, s) => sum + s.deletedCount, 0);
  if (totalDeleted > 0) {
    funFacts.push(`${totalDeleted} messages were deleted in the group`);
  }
  const enGroupHourly = combineHourly(allStats.map((s) => s.hourlyActivity));
  const enGroupPeakHour = getPeakHour(enGroupHourly);
  funFacts.push(`The group is most active around ${enGroupPeakHour}:00`);

  return { summary, dynamics, funFacts: funFacts.slice(0, 3) };
}

// ---- Main Exports ----

/**
 * Generates nickname based on behavior patterns and analysis mode.
 */
export function generateNickname(
  stats: ParticipantStats,
  patterns: BehaviorPattern[],
  allStats: ParticipantStats[],
  lang: Language,
  mode: AnalysisMode
): string {
  const sorted = patterns.filter((p) => p.score >= 30).sort((a, b) => b.score - a.score);
  const modeNicknames = NICKNAME_MAP[mode];

  for (const pattern of sorted) {
    if (pattern.score >= 50 && modeNicknames[pattern.type]) {
      const options = modeNicknames[pattern.type][lang];
      const hash = stats.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return options[hash % options.length];
    }
  }

  return getStatBasedNickname(stats, allStats, lang, mode);
}

/**
 * Runs full local analysis for all participants and group — no LLM needed.
 * Mode-aware: each mode produces different tone and style.
 */
export function runLocalAnalysis(
  allStats: ParticipantStats[],
  allPatterns: BehaviorPattern[][],
  lang: Language,
  mode: AnalysisMode
): {
  participants: ParticipantLocalAnalysis[];
  group: GroupLocalAnalysis;
} {
  const participants = allStats.map((stats, i) => {
    const patterns = allPatterns[i];
    return {
      nickname: generateNickname(stats, patterns, allStats, lang, mode),
      personality: generatePersonality(stats, patterns, allStats, lang, mode),
      gossip: generateGossip(stats, patterns, allStats, lang, mode),
      warning: generateWarning(stats, patterns, lang, mode),
    };
  });

  const group = generateGroupAnalysis(allStats, allPatterns, lang, mode);

  return { participants, group };
}
