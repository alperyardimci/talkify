import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';
import type { AnalysisMode } from '@/src/types';

const MODES: AnalysisMode[] = ['falci_teyze', 'psikolog', 'mahalle_abisi', 'futbol_aski', 'gamer'];

interface AnalysisModeSelectorProps {
  selectedMode: AnalysisMode;
  onSelect: (mode: AnalysisMode) => void;
}

export function AnalysisModeSelector({ selectedMode, onSelect }: AnalysisModeSelectorProps) {
  const { colors } = useTheme();
  const s = useStrings();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {MODES.map((mode) => {
        const isSelected = mode === selectedMode;
        return (
          <Pressable
            key={mode}
            onPress={() => onSelect(mode)}
            style={[
              styles.card,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={styles.icon}>{s.modeIcons[mode]}</Text>
            <Text
              style={[
                styles.modeName,
                { color: isSelected ? '#FFFFFF' : colors.text },
              ]}
              numberOfLines={1}
            >
              {s.modes[mode]}
            </Text>
            <Text
              style={[
                styles.modeDesc,
                { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary },
              ]}
              numberOfLines={2}
            >
              {s.modeDescriptions[mode]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xs,
    gap: Spacing.sm,
  },
  card: {
    width: 130,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 28,
  },
  modeName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  modeDesc: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    lineHeight: 14,
  },
});
