import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { Card, Caption } from '@/src/components/ui';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';
import type { DuoResponseTimeStats } from '@/src/types';

interface DuoResponseTimeProps {
  stats: DuoResponseTimeStats;
}

export function DuoResponseTime({ stats }: DuoResponseTimeProps) {
  const { colors } = useTheme();
  const s = useStrings();

  const maxWait = Math.max(stats.participant1.avgWaitMinutes, stats.participant2.avgWaitMinutes, 1);

  const renderBar = (participant: typeof stats.participant1, isLongerWaiter: boolean) => {
    const proportion = participant.avgWaitMinutes / maxWait;

    return (
      <View style={styles.participantRow}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.participantName,
              { color: colors.text },
              isLongerWaiter && { fontWeight: FontWeight.bold },
            ]}
            numberOfLines={1}
          >
            {participant.name}
            {isLongerWaiter ? ' *' : ''}
          </Text>
        </View>

        <View style={styles.barContainer}>
          <View
            style={[
              styles.bar,
              {
                width: `${Math.max(proportion * 100, 8)}%`,
                backgroundColor: isLongerWaiter ? colors.warning : colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.statsRow}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {participant.avgWaitMinutes} {s.statistics.minutes}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {participant.totalResponses} {s.statistics.duoTotalResponses.toLowerCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card>
      {renderBar(stats.participant1, stats.longerWaiterName === stats.participant1.name)}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      {renderBar(stats.participant2, stats.longerWaiterName === stats.participant2.name)}

      <Caption style={styles.note}>
        * {s.statistics.duoLongerWaiter} {'\u00B7'} {s.statistics.duoNightExcluded}
      </Caption>
    </Card>
  );
}

const styles = StyleSheet.create({
  participantRow: {
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
  },
  barContainer: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    width: '100%',
  },
  bar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  statLabel: {
    fontSize: FontSize.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.sm,
  },
  note: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
