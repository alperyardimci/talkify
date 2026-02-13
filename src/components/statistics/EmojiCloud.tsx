import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card } from '@/src/components/ui';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { EmojiUsage } from '@/src/types';

interface EmojiCloudProps {
  emojis: EmojiUsage[];
}

const MAX_DISPLAY = 20;
const MIN_FONT = 20;
const MAX_FONT = 40;

export function EmojiCloud({ emojis }: EmojiCloudProps) {
  const { colors } = useTheme();

  const topEmojis = emojis.slice(0, MAX_DISPLAY);
  const maxCount = Math.max(...topEmojis.map((e) => e.count), 1);
  const minCount = Math.min(...topEmojis.map((e) => e.count), 0);

  function getFontSize(count: number): number {
    if (maxCount === minCount) return (MIN_FONT + MAX_FONT) / 2;
    const ratio = (count - minCount) / (maxCount - minCount);
    return MIN_FONT + ratio * (MAX_FONT - MIN_FONT);
  }

  return (
    <Card>
      <View style={styles.grid}>
        {topEmojis.map((item, index) => (
          <View
            key={`${item.emoji}-${index}`}
            style={[
              styles.emojiItem,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Text style={[styles.emoji, { fontSize: getFontSize(item.count) }]}>
              {item.emoji}
            </Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {item.count.toLocaleString('tr-TR')}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  emojiItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 60,
  },
  emoji: {
    textAlign: 'center',
  },
  count: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
});
