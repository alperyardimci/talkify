// ============================================
// Talkify - Turkish Locale Utilities
// ============================================

/**
 * Turkish AM/PM period indicators:
 * - ÖÖ (Öğleden Önce) = AM (ante meridiem) - before noon
 * - ÖS (Öğleden Sonra) = PM (post meridiem) - after noon
 */

export type TurkishPeriod = 'ÖÖ' | 'ÖS';

/**
 * Converts a Turkish time period indicator to the equivalent English AM/PM string.
 * Handles case-insensitive matching for both ÖÖ/öö and ÖS/ös.
 *
 * @param period - The Turkish period string (ÖÖ, ÖS, öö, ös)
 * @returns 'AM' for ÖÖ, 'PM' for ÖS, or null if the input is not recognized
 */
export function convertTurkishPeriod(period: string): 'AM' | 'PM' | null {
  const normalized = period.toUpperCase();

  switch (normalized) {
    case 'ÖÖ':
      return 'AM';
    case 'ÖS':
      return 'PM';
    default:
      return null;
  }
}

/**
 * Checks whether the given string is a valid Turkish AM/PM period indicator.
 * Case-insensitive: accepts ÖÖ, öö, ÖS, ös.
 *
 * @param value - The string to check
 * @returns true if the value is a recognized Turkish period
 */
export function isTurkishPeriod(value: string): boolean {
  const normalized = value.toUpperCase();
  return normalized === 'ÖÖ' || normalized === 'ÖS';
}

/**
 * Converts a 12-hour time with a Turkish period indicator to 24-hour format.
 *
 * @param hour - The hour in 12-hour format (1-12)
 * @param period - The Turkish period string (ÖÖ or ÖS)
 * @returns The hour in 24-hour format (0-23), or the original hour if period is invalid
 */
export function to24Hour(hour: number, period: string): number {
  const amPm = convertTurkishPeriod(period);

  if (!amPm) return hour;

  if (amPm === 'PM' && hour !== 12) {
    return hour + 12;
  }

  if (amPm === 'AM' && hour === 12) {
    return 0;
  }

  return hour;
}
