import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card, Badge, Subtitle, Body, Caption } from '@/src/components/ui';
import { Strings } from '@/src/constants/strings';
import {
  BorderRadius,
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

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Nickname header */}
      <View
        style={[styles.nicknameContainer, { backgroundColor: colors.nicknameBg }]}
      >
        <Subtitle color={colors.nicknameText} style={styles.nickname}>
          {analysis.nickname}
        </Subtitle>
      </View>

      {/* Name */}
      <Caption style={styles.name}>{analysis.name}</Caption>

      {/* Personality */}
      <View style={styles.section}>
        <Caption style={styles.sectionLabel}>
          {Strings.analysis.personality}
        </Caption>
        <Body>{analysis.personality}</Body>
      </View>

      {/* Behavior pattern badges */}
      {analysis.behaviorPatterns.length > 0 && (
        <View style={styles.section}>
          <Caption style={styles.sectionLabel}>
            {Strings.statistics.behaviorPatterns}
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
  nicknameContainer: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  nickname: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  name: {
    marginBottom: Spacing.md,
    fontSize: FontSize.md,
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
