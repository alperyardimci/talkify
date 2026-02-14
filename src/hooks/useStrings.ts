import { useSettingsStore } from '@/src/stores';
import { allStrings } from '@/src/constants/strings';

export function useStrings() {
  const language = useSettingsStore((s) => s.language);
  return allStrings[language];
}
