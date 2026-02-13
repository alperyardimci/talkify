import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Strings } from '@/src/constants/strings';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';

interface FileUploaderProps {
  onPickFile: () => void;
  fileName?: string;
  isLoading?: boolean;
}

export function FileUploader({
  onPickFile,
  fileName,
  isLoading = false,
}: FileUploaderProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: fileName ? colors.success : colors.primary,
          backgroundColor: fileName
            ? colors.success + '08'
            : colors.primary + '08',
        },
        pressed && !isLoading && styles.pressed,
      ]}
      onPress={onPickFile}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Text style={styles.icon}>{fileName ? '\u2705' : '\uD83D\uDCC1'}</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {fileName ?? Strings.home.uploadButton}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {fileName
              ? Strings.home.title
              : Strings.home.uploadHint}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.4,
  },
});
