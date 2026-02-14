import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { Card } from '@/src/components/ui';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { ParticipantStats } from '@/src/types';
import { TopWords } from './TopWords';

interface ParticipantListProps {
  stats: ParticipantStats[];
  onPress?: (participantId: string) => void;
}

export function ParticipantList({ stats, onPress }: ParticipantListProps) {
  const { colors } = useTheme();
  const s = useStrings();

  const maxMessages = Math.max(...stats.map((p) => p.messageCount), 1);

  return (
    <Card>
      {stats.map((participant, index) => {
        const proportion = participant.messageCount / maxMessages;
        const isLast = index === stats.length - 1;

        const row = (
          <View
            key={participant.participantId}
            style={[
              styles.row,
              !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}
          >
            {/* Name, stats and detail button */}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {participant.name}
              </Text>
              <View style={styles.rightInfo}>
                <Text style={[styles.stats, { color: colors.textSecondary }]}>
                  {participant.messageCount.toLocaleString('tr-TR')}{' '}
                  {s.common.messages}
                </Text>
                {onPress && (
                  <Pressable
                    onPress={() => onPress(participant.participantId)}
                    style={({ pressed }) => [
                      styles.detailButton,
                      { backgroundColor: colors.primary },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={styles.detailButtonText}>
                      {s.common.detail} ›
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Proportional bar */}
            <View style={[styles.barContainer, { backgroundColor: colors.border + '60' }]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${Math.max(proportion * 100, 5)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>

            {/* Top words */}
            {participant.topWords.length > 0 && (
              <View style={styles.topWordsContainer}>
                <TopWords words={participant.topWords.slice(0, 5)} />
              </View>
            )}
          </View>
        );

        if (onPress) {
          return (
            <Pressable
              key={participant.participantId}
              onPress={() => onPress(participant.participantId)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              {row}
            </Pressable>
          );
        }

        return row;
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.sm,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stats: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
  detailButton: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
  },
  detailButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
  barContainer: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    width: '100%',
  },
  bar: {
    height: '100%',
    borderRadius: BorderRadius.full,
    opacity: 0.7,
  },
  topWordsContainer: {
    marginTop: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
