import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';
import { Card } from '@/src/components/ui';
import { BorderRadius, Spacing } from '@/src/constants/theme';

function SkeletonLine({ width, height = 12 }: { width: string | number; height?: number }) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.textTertiary,
          borderRadius: BorderRadius.sm,
        },
        animatedStyle,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <Card style={styles.card}>
      {/* Badge placeholder */}
      <SkeletonLine width={100} height={28} />

      {/* Name placeholder */}
      <View style={styles.nameRow}>
        <SkeletonLine width={120} height={14} />
      </View>

      {/* Personality label + text */}
      <View style={styles.section}>
        <SkeletonLine width={80} height={10} />
        <View style={styles.textBlock}>
          <SkeletonLine width="100%" height={12} />
          <SkeletonLine width="85%" height={12} />
          <SkeletonLine width="70%" height={12} />
        </View>
      </View>

      {/* Badges placeholder */}
      <View style={styles.badgeRow}>
        <SkeletonLine width={70} height={24} />
        <SkeletonLine width={90} height={24} />
        <SkeletonLine width={60} height={24} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  nameRow: {
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  textBlock: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
});
