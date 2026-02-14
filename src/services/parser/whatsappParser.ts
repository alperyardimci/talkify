// ============================================
// Talkify - Main WhatsApp Chat Parser
// ============================================

import type {
  ParsedChat,
  ParsedMessage,
  ChatParticipant,
  GroupTitleChange,
  ParseProgress,
  DateFormatType,
} from '@/src/types';
import { detectFormat, parseTimestamp } from './datePatterns';
import { classifyMessage } from './messageTypes';

/**
 * Separator used to distinguish sender from message content.
 * WhatsApp uses ": " (colon followed by space) after the sender name.
 */
const SENDER_SEPARATOR = ': ';

/**
 * Remove invisible Unicode characters that WhatsApp adds to exports.
 * These include LTR marks (\u200E), RTL marks (\u200F), zero-width spaces (\u200B),
 * and other format characters (\u202A-\u202E, \uFEFF).
 */
function cleanUnicode(text: string): string {
  return text.replace(/[\u200B\u200C\u200D\u200E\u200F\u202A-\u202E\uFEFF]/g, '');
}

/**
 * Progress reporting batch size.
 * We report progress every N lines to avoid excessive callback invocations.
 */
const PROGRESS_BATCH = 200;

/**
 * Extracts the sender name and message content from the "rest" portion
 * of a parsed line (i.e., everything after the timestamp prefix).
 *
 * For normal messages: "Sender Name: message content"
 * For system messages (no colon): the entire rest is the content, sender is empty.
 *
 * @param rest - The line content after the timestamp has been stripped
 * @returns An object with sender and content
 */
function extractSenderAndContent(rest: string): {
  sender: string;
  content: string;
} {
  const separatorIndex = rest.indexOf(SENDER_SEPARATOR);

  if (separatorIndex === -1) {
    // No sender separator found -- this is a system message
    return { sender: '', content: rest };
  }

  const sender = rest.slice(0, separatorIndex).trim();
  const content = rest.slice(separatorIndex + SENDER_SEPARATOR.length);

  // Validate sender: it should not be excessively long (probably not a real sender)
  // and should not contain newlines. WhatsApp sender names are typically short.
  if (sender.length > 100 || sender.includes('\n')) {
    return { sender: '', content: rest };
  }

  // Check if the sender portion looks like a system message (e.g. group title changes)
  // by classifying it — if the sender text itself is a system message, treat the
  // entire line as a system message with no sender.
  if (classifyMessage(sender) === 'system' || classifyMessage(rest) === 'system') {
    return { sender: '', content: rest };
  }

  return { sender, content };
}

/**
 * Report parsing progress through the optional callback.
 */
function reportProgress(
  onProgress: ((progress: ParseProgress) => void) | undefined,
  stage: ParseProgress['stage'],
  progress: number,
  message: string,
  totalLines?: number,
  processedLines?: number
): void {
  if (onProgress) {
    onProgress({
      stage,
      progress: Math.min(100, Math.max(0, Math.round(progress))),
      message,
      totalLines,
      processedLines,
    });
  }
}

/**
 * Build the participants map from parsed messages.
 * Each unique sender gets a ChatParticipant entry with aggregated stats.
 *
 * @param messages - The array of parsed messages
 * @returns An array of ChatParticipant objects
 */
function buildParticipants(messages: ParsedMessage[]): ChatParticipant[] {
  const participantMap = new Map<
    string,
    {
      name: string;
      messageCount: number;
      firstMessage: Date;
      lastMessage: Date;
    }
  >();

  for (const msg of messages) {
    // Skip system messages and messages with no sender
    if (!msg.sender) continue;

    const existing = participantMap.get(msg.sender);

    if (existing) {
      existing.messageCount++;
      if (msg.timestamp < existing.firstMessage) {
        existing.firstMessage = msg.timestamp;
      }
      if (msg.timestamp > existing.lastMessage) {
        existing.lastMessage = msg.timestamp;
      }
    } else {
      participantMap.set(msg.sender, {
        name: msg.sender,
        messageCount: 1,
        firstMessage: msg.timestamp,
        lastMessage: msg.timestamp,
      });
    }
  }

  const participants: ChatParticipant[] = [];
  let idCounter = 1;

  for (const [, data] of participantMap) {
    participants.push({
      id: `participant_${idCounter++}`,
      name: data.name,
      messageCount: data.messageCount,
      firstMessage: data.firstMessage,
      lastMessage: data.lastMessage,
    });
  }

  // Sort by message count descending
  participants.sort((a, b) => b.messageCount - a.messageCount);

  return participants;
}

/**
 * Derive a chat name from the participants list.
 * Uses the top participants' names, or a generic label.
 *
 * @param participants - The sorted participants array
 * @returns A string representing the chat name
 */
function deriveChatName(participants: ChatParticipant[]): string {
  if (participants.length === 0) {
    return 'Unknown Chat';
  }

  if (participants.length === 2) {
    return `${participants[0].name} & ${participants[1].name}`;
  }

  if (participants.length <= 4) {
    return participants.map((p) => p.name).join(', ');
  }

  // Group chat with many participants
  const topNames = participants
    .slice(0, 3)
    .map((p) => p.name)
    .join(', ');
  return `${topNames} +${participants.length - 3}`;
}

/**
 * Extract group title/subject changes from system messages.
 *
 * Detects patterns like:
 * - Turkish: '... grubun konusunu "Yeni Başlık" olarak değiştirdi'
 * - Turkish: '... grubun adını "Yeni Ad" olarak değiştirdi'
 * - English: '... changed the subject to "New Title"'
 * - English: '... changed the group name to "New Name"'
 *
 * @param messages - The array of parsed messages
 * @returns An array of GroupTitleChange objects sorted newest-first
 */
function extractGroupTitleChanges(messages: ParsedMessage[]): GroupTitleChange[] {
  const changes: GroupTitleChange[] = [];

  // Turkish patterns: 'X grubun konusunu "Y" olarak değiştirdi' or 'X grubun adını "Y" olarak değiştirdi'
  const trPattern = /^(.+?)\s+(?:grubun konusunu|grubun adını|grup adını)\s+"(.+?)"\s+olarak değiştirdi$/;
  // English patterns: 'X changed the subject to "Y"' or 'X changed the group name to "Y"'
  const enPattern = /^(.+?)\s+changed (?:the subject|the group name|the group) to "(.+?)"$/;

  for (const msg of messages) {
    if (msg.type !== 'system') continue;

    const content = msg.content.trim();
    const trMatch = trPattern.exec(content);
    if (trMatch) {
      changes.push({
        date: msg.timestamp,
        changedBy: trMatch[1].trim(),
        newTitle: trMatch[2],
      });
      continue;
    }

    const enMatch = enPattern.exec(content);
    if (enMatch) {
      changes.push({
        date: msg.timestamp,
        changedBy: enMatch[1].trim(),
        newTitle: enMatch[2],
      });
    }
  }

  // Newest first
  changes.sort((a, b) => b.date.getTime() - a.date.getTime());
  return changes;
}

/**
 * Parse a WhatsApp chat export string into structured data.
 *
 * This is the main entry point for the parser. It handles:
 * - Multiple date formats (Turkish 24h, Turkish 12h, iOS Turkish, English)
 * - Multiline messages (lines without a timestamp are appended to the previous message)
 * - System messages (no sender)
 * - Progress reporting via optional callback
 *
 * @param content - The raw text content of the WhatsApp chat export
 * @param onProgress - Optional callback to report parsing progress
 * @returns A Promise resolving to a ParsedChat object
 */
export async function parseWhatsAppChat(
  content: string,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParsedChat> {
  // --- Stage 1: Split into lines ---
  reportProgress(onProgress, 'reading', 5, 'Dosya okunuyor...');

  const lines = content.split('\n');
  const totalLines = lines.length;

  if (totalLines === 0) {
    reportProgress(onProgress, 'error', 0, 'Dosya boş.');
    throw new Error('Chat export is empty.');
  }

  reportProgress(
    onProgress,
    'reading',
    10,
    `${totalLines} satır okundu.`,
    totalLines,
    0
  );

  // --- Stage 2: Detect date format ---
  reportProgress(onProgress, 'detecting', 15, 'Tarih formatı tespit ediliyor...');

  const cleanedSample = lines.slice(0, 30).map(cleanUnicode);
  const format: DateFormatType = detectFormat(cleanedSample);

  reportProgress(
    onProgress,
    'detecting',
    20,
    `Format tespit edildi: ${format}`,
    totalLines,
    0
  );

  // --- Stage 3: Parse messages ---
  reportProgress(onProgress, 'parsing', 25, 'Mesajlar ayrıştırılıyor...');

  const messages: ParsedMessage[] = [];
  let currentMessage: ParsedMessage | null = null;
  let messageIndex = 0;

  for (let i = 0; i < totalLines; i++) {
    const line = cleanUnicode(lines[i]);

    // Skip completely empty lines at the start/end
    if (!line && !currentMessage) continue;

    // Try to parse as a new message (line starts with timestamp)
    const parsed = parseTimestamp(line, format);

    if (parsed) {
      // Finalize the previous message if it exists
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const { sender, content: msgContent } = extractSenderAndContent(
        parsed.rest
      );

      const rawType = classifyMessage(sender ? msgContent : parsed.rest);
      const isSystem = !sender || rawType === 'system';

      currentMessage = {
        id: `msg_${messageIndex++}`,
        timestamp: parsed.date,
        sender: isSystem ? '' : sender,
        content: sender ? msgContent : parsed.rest,
        type: isSystem ? 'system' : rawType,
        isMultiline: false,
      };
    } else if (currentMessage) {
      // This line has no timestamp -- it's a continuation of the previous message
      currentMessage.content += '\n' + line;
      currentMessage.isMultiline = true;

      // Re-classify after appending (content may now contain a link, etc.)
      if (currentMessage.type === 'text') {
        const reclassified = classifyMessage(currentMessage.content);
        if (reclassified !== 'text') {
          currentMessage.type = reclassified;
        }
      }
    }
    // If there is no currentMessage and the line doesn't parse, we skip it
    // (this handles junk lines at the top of the file)

    // Report progress periodically
    if (i > 0 && i % PROGRESS_BATCH === 0) {
      const progressPct = 25 + (i / totalLines) * 50; // 25% to 75%
      reportProgress(
        onProgress,
        'parsing',
        progressPct,
        `${i}/${totalLines} satır işlendi...`,
        totalLines,
        i
      );

      // Yield to the event loop periodically for large files
      // so the UI thread can update and render progress
      if (i % (PROGRESS_BATCH * 5) === 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  // Don't forget the last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  reportProgress(
    onProgress,
    'parsing',
    75,
    `${messages.length} mesaj ayrıştırıldı.`,
    totalLines,
    totalLines
  );

  // --- Stage 4: Classify and build metadata ---
  reportProgress(
    onProgress,
    'classifying',
    80,
    'Katılımcılar belirleniyor...'
  );

  const participants = buildParticipants(messages);

  reportProgress(
    onProgress,
    'classifying',
    90,
    `${participants.length} katılımcı bulundu.`
  );

  // Determine date range
  const startDate =
    messages.length > 0 ? messages[0].timestamp : new Date();
  const endDate =
    messages.length > 0 ? messages[messages.length - 1].timestamp : new Date();

  // Derive chat name
  const chatName = deriveChatName(participants);

  // Extract group title change history
  const groupTitleHistory = extractGroupTitleChanges(messages);

  // --- Stage 5: Done ---
  const result: ParsedChat = {
    messages,
    participants,
    startDate,
    endDate,
    totalMessages: messages.length,
    chatName,
    groupTitleHistory,
  };

  reportProgress(
    onProgress,
    'done',
    100,
    `Tamamlandı! ${messages.length} mesaj, ${participants.length} katılımcı.`
  );

  return result;
}
