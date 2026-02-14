// ============================================
// Talkify - Message Type Classification
// ============================================

import type { MessageType } from '@/src/types';

// --- System message patterns (Turkish & English) ---

const SYSTEM_PATTERNS_TR: string[] = [
  'ekledi',
  'çıkardı',
  'çıkarıldı',
  'değiştirdi',
  'değiştirildi',
  'oluşturdu',
  'ayrıldı',
  'katıldı',
  'silindi',
  'şifrelemesi',
  'güvenlik kodu',
  'grubun simgesini',
  'grubun konusunu',
  'grubun açıklamasını',
  'bu gruba davet',
  'numarasını değiştirdi',
  'artık yönetici',
  'kaldırıldı',
  'ayarları değiştirdi',
  'kaybolma süresini',
  'mesajların kaybolma',
  'uçtan uca şifrelidir',
  'uçtan uca şifrelenir',
  'sizi ekledi',
  'grubunu oluşturdu',
  'bu işletme hesabı',
  'yönetici olarak',
  'grubun ayarlarını',
  'bu grubu oluşturdu',
  'grubun adını',
  'grubun adı',
  'grup adını',
  'grup simgesini',
  'gruba eklendi',
  'gruptan ayrıldı',
  'konu değiştirildi',
];

const SYSTEM_PATTERNS_EN: string[] = [
  'added',
  'removed',
  'left',
  'joined',
  'changed the subject',
  'changed the group',
  'changed this group',
  'created group',
  'security code changed',
  'Messages and calls are end-to-end encrypted',
  'changed their phone number',
  'is now an admin',
  'turned on disappearing messages',
  'turned off disappearing messages',
];

// --- Media patterns ---

const MEDIA_PATTERNS: string[] = [
  '<Medya dahil edilmedi>',
  '<Media omitted>',
  'image omitted',
  'video omitted',
  'sticker omitted',
  'GIF omitted',
  'audio omitted',
  'document omitted',
  'Contact card omitted',
  '<Dosya dahil edilmedi>',
  '<Kişi kartı dahil edilmedi>',
  'görüntü dahil edilmedi',
  'video dahil edilmedi',
  'ses dahil edilmedi',
  'belge dahil edilmedi',
  'çıkartma dahil edilmedi',
  'GIF dahil edilmedi',
  'kişi kartı dahil edilmedi',
];

// --- Deleted message patterns ---

const DELETED_PATTERNS: string[] = [
  'Bu mesaj silindi',
  'Bu mesajı sildiniz',
  'This message was deleted',
  'You deleted this message',
];

// --- URL detection regex ---

const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

/**
 * Classify a message content string into one of the known message types.
 * Checks are performed in order of specificity:
 *   1. Deleted messages (exact/near-exact matches)
 *   2. Media (known media-omitted strings)
 *   3. System messages (contain system action keywords)
 *   4. Links (contain URLs)
 *   5. Default: plain text
 *
 * @param content - The message body text to classify
 * @returns The classified MessageType
 */
export function classifyMessage(content: string): MessageType {
  const trimmed = content.trim();

  // Empty content is text by default
  if (!trimmed) return 'text';

  // 1. Check for deleted messages
  for (const pattern of DELETED_PATTERNS) {
    if (trimmed === pattern) {
      return 'deleted';
    }
  }

  // 2. Check for media messages
  for (const pattern of MEDIA_PATTERNS) {
    if (trimmed.includes(pattern)) {
      return 'media';
    }
  }

  // 3. Check for system messages (Turkish patterns)
  for (const pattern of SYSTEM_PATTERNS_TR) {
    if (trimmed.includes(pattern)) {
      return 'system';
    }
  }

  // 3b. Check for system messages (English patterns)
  for (const pattern of SYSTEM_PATTERNS_EN) {
    if (trimmed.includes(pattern)) {
      return 'system';
    }
  }

  // 4. Check for links
  if (URL_REGEX.test(trimmed)) {
    return 'link';
  }

  // 5. Default: text
  return 'text';
}
