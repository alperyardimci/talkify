import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';
import type { WordFrequency } from '@/src/types';

interface TopWordsProps {
  words: WordFrequency[];
}

export function TopWords({ words }: TopWordsProps) {
  const { colors } = useTheme();

  if (words.length === 0) return null;

  const maxCount = words[0].count;

  return (
    <View style={styles.container}>
      {words.map((item) => {
        const ratio = item.count / maxCount;
        const opacity = 0.4 + ratio * 0.6;
        const fontSize = FontSize.xs + ratio * 3;

        return (
          <View
            key={item.word}
            style={[
              styles.chip,
              { backgroundColor: colors.primary + Math.round(opacity * 40).toString(16).padStart(2, '0') },
            ]}
          >
            <Text style={[styles.word, { color: colors.primary, fontSize }]}>
              {item.word}
            </Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {item.count}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  word: {
    fontWeight: FontWeight.medium,
  },
  count: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
});
