import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  color,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const barColor = color ?? colors.primary;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && (
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text style={[styles.percentage, { color: colors.textSecondary }]}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.surfaceSecondary }]}>
        <Animated.View
          style={[
            styles.bar,
            {
              backgroundColor: barColor,
              width: widthInterpolation,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  percentage: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  track: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
