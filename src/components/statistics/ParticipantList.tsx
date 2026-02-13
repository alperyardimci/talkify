import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card } from '@/src/components/ui';
import { Strings } from '@/src/constants/strings';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { ParticipantStats } from '@/src/types';

interface ParticipantListProps {
  stats: ParticipantStats[];
  onPress?: (participantId: string) => void;
}

export function ParticipantList({ stats, onPress }: ParticipantListProps) {
  const { colors } = useTheme();

  const maxMessages = Math.max(...stats.map((s) => s.messageCount), 1);

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
            {/* Name and stats */}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {participant.name}
              </Text>
              <Text style={[styles.stats, { color: colors.textSecondary }]}>
                {participant.messageCount.toLocaleString('tr-TR')}{' '}
                {Strings.common.messages}
                {'  \u00B7  '}
                {participant.wordCount.toLocaleString('tr-TR')}{' '}
                {Strings.common.words}
              </Text>
            </View>

            {/* Proportional bar */}
            <View style={styles.barContainer}>
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
  stats: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
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
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
});
