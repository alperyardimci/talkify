import { Colors, ThemeColors } from '@/src/constants/theme';

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  return { colors: Colors.light, isDark: false };
}
