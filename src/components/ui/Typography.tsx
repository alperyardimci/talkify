import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { FontSize, FontWeight } from '@/src/constants/theme';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
}

export function Title({ children, style, color, ...rest }: TypographyProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: color ?? colors.text }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Subtitle({ children, style, color, ...rest }: TypographyProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.subtitle, { color: color ?? colors.text }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Body({ children, style, color, ...rest }: TypographyProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.body, { color: color ?? colors.textSecondary }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, color, ...rest }: TypographyProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.caption, { color: color ?? colors.textTertiary }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Label({ children, style, color, ...rest }: TypographyProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.label, { color: color ?? colors.textSecondary }, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * 1.5,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
