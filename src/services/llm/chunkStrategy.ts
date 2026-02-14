// ============================================
// Talkify - LLM Context Chunking Strategy
// ============================================

import type { BehaviorPattern, ParsedMessage, ParticipantStats } from '@/src/types';

interface ParticipantContext {
  stats: string;
  sampleMessages: string[];
}

/**
 * Saat değerini HH:MM formatına dönüştürür.
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Bir mesajın gece mesajı olup olmadığını kontrol eder (00:00-06:00).
 */
function isNightMessage(message: ParsedMessage): boolean {
  const hour = message.timestamp.getHours();
  return hour >= 0 && hour < 6;
}

/**
 * Bir mesajdaki emoji sayısını hesaplar.
 */
function countEmojis(text: string): number {
  const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

/**
 * Diziden rastgele elemanlar seçer.
 */
function pickRandom<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) {
    return [...arr];
  }
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * Mesaj listesini "HH:MM - içerik" formatında biçimlendirir.
 */
function formatMessage(message: ParsedMessage): string {
  return `${formatTime(message.timestamp)} - ${message.content}`;
}

/**
 * Katılımcı verilerini LLM'e gönderilecek kompakt bağlam formatına dönüştürür.
 *
 * Ham sohbet loglarını göndermek yerine:
 * 1. Temel istatistiklerin özetini oluşturur
 * 2. Temsili örnek mesajlar seçer (en fazla 8):
 *    - 2 en uzun metin mesajı
 *    - 2 en kısa metin mesajı
 *    - 2 en çok emoji içeren mesaj
 *    - 2 rastgele mesaj
 * 3. Tekrarlananları kaldırıp formatlar
 *
 * Bu yaklaşım bağlamı ~1024 token altında tutar.
 */
export function prepareParticipantContext(
  participant: ParticipantStats,
  messages: ParsedMessage[],
  patterns: BehaviorPattern[]
): ParticipantContext {
  // Sadece bu katılımcının metin mesajlarını filtrele
  const participantMessages = messages.filter(
    (m) => m.sender === participant.name && m.type === 'text' && m.content.trim().length > 0
  );

  // --- İstatistik özeti ---
  const avgResponseStr =
    participant.avgResponseTimeMinutes != null
      ? `${Math.round(participant.avgResponseTimeMinutes)} dk`
      : 'N/A';

  const topEmojis = participant.uniqueEmojis
    .slice(0, 5)
    .map((e) => `${e.emoji}(${e.count})`)
    .join(', ');

  const patternSummary = patterns
    .filter((p) => p.score >= 30)
    .map((p) => `${p.label}(${p.score})`)
    .join(', ');

  const statsStr = [
    `Mesaj: ${participant.messageCount}`,
    `Kelime: ${participant.wordCount}`,
    `Ort. kelime/mesaj: ${participant.avgWordsPerMessage.toFixed(1)}`,
    `Emoji: ${participant.emojiCount}`,
    `Medya: ${participant.mediaCount}`,
    `Link: ${participant.linkCount}`,
    `Silinen: ${participant.deletedCount}`,
    `Soru: ${participant.questionCount}`,
    `Tek kelime: ${participant.singleWordCount}`,
    `Art arda: ${participant.consecutiveMessages}`,
    `Gece oranı: %${(participant.nightMessageRatio * 100).toFixed(1)}`,
    `Sohbet başlatma: ${participant.conversationStartCount}`,
    `Ort. yanıt: ${avgResponseStr}`,
    topEmojis ? `Emojiler: ${topEmojis}` : null,
    patternSummary ? `Kalıplar: ${patternSummary}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  // --- Temsili mesaj seçimi ---
  const selectedIds = new Set<string>();
  const selectedMessages: ParsedMessage[] = [];

  const addUnique = (msgs: ParsedMessage[]) => {
    for (const msg of msgs) {
      if (!selectedIds.has(msg.id)) {
        selectedIds.add(msg.id);
        selectedMessages.push(msg);
      }
    }
  };

  // En uzun 2 mesaj
  const byLength = [...participantMessages].sort(
    (a, b) => b.content.length - a.content.length
  );
  addUnique(byLength.slice(0, 2));

  // En kısa 2 mesaj (en az 1 karakter)
  const byShortLength = [...participantMessages]
    .filter((m) => m.content.trim().length >= 1)
    .sort((a, b) => a.content.length - b.content.length);
  addUnique(byShortLength.slice(0, 2));

  // En çok emoji içeren 2 mesaj
  const byEmoji = [...participantMessages].sort(
    (a, b) => countEmojis(b.content) - countEmojis(a.content)
  );
  const emojiMessages = byEmoji.filter((m) => countEmojis(m.content) > 0);
  addUnique(emojiMessages.slice(0, 2));

  // 2 rastgele mesaj (henüz seçilmemişlerden)
  const remaining = participantMessages.filter((m) => !selectedIds.has(m.id));
  addUnique(pickRandom(remaining, 2));

  // Kronolojik sırala ve formatla
  const sortedMessages = [...selectedMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const sampleMessages = sortedMessages
    .slice(0, 8)
    .map(formatMessage);

  return {
    stats: statsStr,
    sampleMessages,
  };
}
