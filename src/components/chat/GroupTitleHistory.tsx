import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { Card, Subtitle, Body, Caption, Badge } from '@/src/components/ui';
import { Spacing, BorderRadius, FontWeight } from '@/src/constants/theme';
import type { GroupTitleChange } from '@/src/types';

interface GroupTitleHistoryProps {
  history: GroupTitleChange[];
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export function GroupTitleHistory({ history }: GroupTitleHistoryProps) {
  const { colors } = useTheme();
  const s = useStrings();

  if (history.length === 0) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Subtitle>{s.home.groupTitleHistory}</Subtitle>
        <Badge
          text={`${history.length} ${s.home.titleChanges}`}
          color={colors.primary}
        />
      </View>

      {history.map((change, index) => (
        <View
          key={`${change.date.getTime()}-${index}`}
          style={[
            styles.entry,
            index < history.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={styles.entryContent}>
            <Body style={{ fontWeight: FontWeight.semibold }}>
              {change.newTitle}
            </Body>
            <Caption>
              {formatDate(change.date)} · {s.home.changedBy}: {change.changedBy}
            </Caption>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginTop: 6,
  },
  entryContent: {
    flex: 1,
    gap: 2,
  },
});
