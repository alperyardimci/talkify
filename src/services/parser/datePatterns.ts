// ============================================
// Talkify - WhatsApp Date Format Detection & Parsing
// ============================================

import type { DateFormatType } from '@/src/types';

// --- Regex patterns for each WhatsApp export format ---

/**
 * Turkish 24-hour format (Android):
 * Example: "1.12.2023 10:30 - Sender: Message"
 */
export const TURKISH_24H = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s(\d{1,2}):(\d{2})\s-\s/;

/**
 * Turkish 12-hour format (Android with AM/PM):
 * Example: "1.12.2023 ÖS 2:30 - Sender: Message"
 * ÖÖ = Öğleden Önce (AM), ÖS = Öğleden Sonra (PM)
 */
export const TURKISH_12H = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s(ÖÖ|ÖS|öö|ös)\s(\d{1,2}):(\d{2})\s-\s/;

/**
 * iOS Turkish format:
 * Example: "[01.12.2023, 10:30:45] Sender: Message"
 * Also matches without comma: "[26.07.2025 23:04:26] Sender: Message"
 */
export const IOS_TURKISH = /^\[(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]\s?(\d{1,2}):(\d{2}):(\d{2})\]\s/;

/**
 * English format (common US/international):
 * Example: "12/1/23, 10:30 AM - Sender: Message"
 */
export const ENGLISH = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}):(\d{2})\s(AM|PM)\s-\s/;

/**
 * Map of format types to their corresponding regex patterns.
 */
export const DATE_PATTERNS: Record<DateFormatType, RegExp> = {
  turkish_24h: TURKISH_24H,
  turkish_12h: TURKISH_12H,
  ios_turkish: IOS_TURKISH,
  english: ENGLISH,
};

/**
 * The order in which formats are tested during detection.
 * More specific patterns are tested first to avoid false positives.
 * turkish_12h is checked before turkish_24h because the 24h pattern
 * could partially match a 12h line (the date portion).
 */
const DETECTION_ORDER: DateFormatType[] = [
  'ios_turkish',
  'turkish_12h',
  'turkish_24h',
  'english',
];

/**
 * Detect the date format used in a WhatsApp chat export by testing
 * the first 20 non-empty lines for matching patterns.
 *
 * @param lines - Array of lines from the chat export
 * @returns The detected date format type, defaults to 'turkish_24h' if none matched
 */
export function detectFormat(lines: string[]): DateFormatType {
  const samplesToTest = Math.min(lines.length, 20);
  const matchCounts: Record<DateFormatType, number> = {
    turkish_24h: 0,
    turkish_12h: 0,
    ios_turkish: 0,
    english: 0,
  };

  for (let i = 0; i < samplesToTest; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    for (const format of DETECTION_ORDER) {
      if (DATE_PATTERNS[format].test(line)) {
        matchCounts[format]++;
        break; // One match per line, use the first (most specific) pattern
      }
    }
  }

  // Return the format with the most matches
  let bestFormat: DateFormatType = 'turkish_24h';
  let bestCount = 0;

  for (const format of DETECTION_ORDER) {
    if (matchCounts[format] > bestCount) {
      bestCount = matchCounts[format];
      bestFormat = format;
    }
  }

  return bestFormat;
}

/**
 * Parse the timestamp from the beginning of a line according to the given format.
 *
 * @param line - A single line from the chat export
 * @param format - The date format to use for parsing
 * @returns An object with the parsed Date and the remaining string after the timestamp prefix,
 *          or null if the line does not match the format.
 */
export function parseTimestamp(
  line: string,
  format: DateFormatType
): { date: Date; rest: string } | null {
  const pattern = DATE_PATTERNS[format];
  const match = line.match(pattern);

  if (!match) return null;

  let date: Date;

  switch (format) {
    case 'turkish_24h': {
      // Groups: (day)(month)(year)(hour)(minute)
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
      const year = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      date = new Date(year, month, day, hour, minute, 0);
      break;
    }

    case 'turkish_12h': {
      // Groups: (day)(month)(year)(ÖÖ|ÖS)(hour)(minute)
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const period = match[4].toUpperCase(); // ÖÖ or ÖS
      let hour = parseInt(match[5], 10);
      const minute = parseInt(match[6], 10);

      // Convert 12-hour to 24-hour
      if (period === 'ÖS' && hour !== 12) {
        hour += 12;
      } else if (period === 'ÖÖ' && hour === 12) {
        hour = 0;
      }

      date = new Date(year, month, day, hour, minute, 0);
      break;
    }

    case 'ios_turkish': {
      // Groups: (day)(month)(year)(hour)(minute)(second)
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      const second = parseInt(match[6], 10);
      date = new Date(year, month, day, hour, minute, second);
      break;
    }

    case 'english': {
      // Groups: (month)(day)(year)(hour)(minute)(AM|PM)
      const monthNum = parseInt(match[1], 10) - 1;
      const day = parseInt(match[2], 10);
      let year = parseInt(match[3], 10);
      const period = match[6]; // AM or PM
      let hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);

      // Handle 2-digit year
      if (year < 100) {
        year += 2000;
      }

      // Convert 12-hour to 24-hour
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      date = new Date(year, monthNum, day, hour, minute, 0);
      break;
    }

    default:
      return null;
  }

  // The "rest" is the line content after the matched timestamp prefix
  const rest = line.slice(match[0].length);

  return { date, rest };
}
