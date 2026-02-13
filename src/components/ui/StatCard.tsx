import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const { colors } = useTheme();
  const accentColor = color ?? colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: '#000000',
          shadowOpacity: 0.08,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: accentColor + '20' },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.value, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>
        <Text
          style={[styles.label, { color: colors.textSecondary }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    marginTop: 1,
  },
});
