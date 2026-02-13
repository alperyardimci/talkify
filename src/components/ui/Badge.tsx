import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/src/constants/theme';

interface BadgeProps {
  text: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
}

export function Badge({ text, icon, color, backgroundColor }: BadgeProps) {
  const { colors } = useTheme();

  const textColor = color ?? colors.primary;
  const bgColor = backgroundColor ?? textColor + '18';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  icon: {
    fontSize: FontSize.sm,
    marginRight: Spacing.xs,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
