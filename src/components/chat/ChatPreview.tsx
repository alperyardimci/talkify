import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card, StatCard, Subtitle, Body, Caption } from '@/src/components/ui';
import { Strings } from '@/src/constants/strings';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { ParsedChat } from '@/src/types';

interface ChatPreviewProps {
  chat: ParsedChat;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function ChatPreview({ chat }: ChatPreviewProps) {
  const { colors } = useTheme();

  const dateRange = `${formatDate(chat.startDate)} - ${formatDate(chat.endDate)}`;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <StatCard
            label={Strings.statistics.totalMessages}
            value={chat.totalMessages.toLocaleString('tr-TR')}
            icon={'\uD83D\uDCAC'}
            color={colors.primary}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label={Strings.statistics.participants}
            value={chat.participants.length}
            icon={'\uD83D\uDC65'}
            color={colors.secondary}
          />
        </View>
      </View>

      <Card style={styles.dateCard}>
        <Caption>{Strings.statistics.dateRange}</Caption>
        <Body style={styles.dateText}>{dateRange}</Body>
      </Card>

      <Card style={styles.participantsCard}>
        <Subtitle style={styles.sectionTitle}>
          {Strings.statistics.participants}
        </Subtitle>
        {chat.participants.map((participant) => (
          <View
            key={participant.id}
            style={[
              styles.participantRow,
              { borderBottomColor: colors.border },
            ]}
          >
            <Text style={[styles.participantName, { color: colors.text }]}>
              {participant.name}
            </Text>
            <Text
              style={[
                styles.participantCount,
                { color: colors.textSecondary },
              ]}
            >
              {participant.messageCount.toLocaleString('tr-TR')}{' '}
              {Strings.common.messages}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
  },
  dateCard: {
    paddingVertical: Spacing.md,
  },
  dateText: {
    marginTop: Spacing.xs,
  },
  participantsCard: {},
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  participantName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  participantCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
});
