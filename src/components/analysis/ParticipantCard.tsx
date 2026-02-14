import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { Card, Badge, Subtitle, Body, Caption } from '@/src/components/ui';
import {
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { ParticipantAnalysis } from '@/src/types';

interface ParticipantCardProps {
  analysis: ParticipantAnalysis;
  onPress?: () => void;
}

export function ParticipantCard({ analysis, onPress }: ParticipantCardProps) {
  const { colors } = useTheme();
  const s = useStrings();

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Name as card header */}
      <Subtitle style={styles.name}>{analysis.name}</Subtitle>

      {/* Nickname */}
      <View style={styles.section}>
        <Caption style={styles.sectionLabel}>
          {s.analysis.nickname}
        </Caption>
        <Body style={{ ...styles.nicknameText, color: colors.nicknameText }}>
          {analysis.nickname}
        </Body>
      </View>

      {/* Personality */}
      <View style={styles.section}>
        <Caption style={styles.sectionLabel}>
          {s.analysis.personality}
        </Caption>
        <Body>{analysis.personality}</Body>
      </View>

      {/* Behavior pattern badges */}
      {analysis.behaviorPatterns.length > 0 && (
        <View style={styles.section}>
          <Caption style={styles.sectionLabel}>
            {s.statistics.behaviorPatterns}
          </Caption>
          <View style={styles.badgeContainer}>
            {analysis.behaviorPatterns.map((pattern) => (
              <Badge
                key={pattern.type}
                text={pattern.label}
                icon={pattern.icon}
                color={colors.primary}
              />
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  name: {
    marginBottom: Spacing.sm,
    fontSize: FontSize.lg,
  },
  nicknameText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  section: {
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: FontWeight.semibold,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});
