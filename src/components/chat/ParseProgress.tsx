import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { ProgressBar, Body, Caption } from '@/src/components/ui';
import { Strings } from '@/src/constants/strings';
import { Spacing } from '@/src/constants/theme';
import type { ParseProgress as ParseProgressType } from '@/src/types';

interface ParseProgressProps {
  progress: ParseProgressType;
}

const stageLabels: Record<ParseProgressType['stage'], string> = {
  reading: Strings.home.parsing,
  detecting: Strings.home.detecting,
  parsing: Strings.home.parsing,
  classifying: Strings.home.classifying,
  done: Strings.home.done,
  error: Strings.home.error,
};

export function ParseProgress({ progress }: ParseProgressProps) {
  const { colors } = useTheme();

  const stageLabel = stageLabels[progress.stage];
  const isError = progress.stage === 'error';
  const isDone = progress.stage === 'done';

  const barColor = isError
    ? colors.error
    : isDone
      ? colors.success
      : colors.primary;

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={progress.progress}
        label={stageLabel}
        color={barColor}
        showPercentage
      />
      {progress.message ? (
        <Caption style={styles.message}>{progress.message}</Caption>
      ) : null}
      {progress.totalLines != null && progress.processedLines != null ? (
        <Caption style={styles.lineInfo}>
          {progress.processedLines.toLocaleString('tr-TR')} /{' '}
          {progress.totalLines.toLocaleString('tr-TR')} satir
        </Caption>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.sm,
  },
  message: {
    marginTop: Spacing.xs,
  },
  lineInfo: {
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
