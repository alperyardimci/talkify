import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { StatCard } from '@/src/components/ui';
import { Strings } from '@/src/constants/strings';
import { Spacing } from '@/src/constants/theme';
import type { ChatStatistics } from '@/src/types';

interface StatsSummaryProps {
  statistics: ChatStatistics;
}

export function StatsSummary({ statistics }: StatsSummaryProps) {
  const { colors } = useTheme();

  const stats = [
    {
      label: Strings.statistics.totalMessages,
      value: statistics.totalMessages.toLocaleString('tr-TR'),
      icon: '\uD83D\uDCAC',
      color: colors.primary,
    },
    {
      label: Strings.statistics.totalWords,
      value: statistics.totalWords.toLocaleString('tr-TR'),
      icon: '\uD83D\uDCDD',
      color: colors.secondary,
    },
    {
      label: Strings.statistics.totalEmojis,
      value: statistics.totalEmojis.toLocaleString('tr-TR'),
      icon: '\uD83D\uDE0A',
      color: colors.accent,
    },
    {
      label: Strings.statistics.totalMedia,
      value: statistics.totalMedia.toLocaleString('tr-TR'),
      icon: '\uD83D\uDCF7',
      color: colors.warning,
    },
    {
      label: Strings.statistics.totalLinks,
      value: statistics.totalLinks.toLocaleString('tr-TR'),
      icon: '\uD83D\uDD17',
      color: colors.success,
    },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.gridItem}>
          <StatCard
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    flexBasis: '47%',
    flexGrow: 1,
  },
});
