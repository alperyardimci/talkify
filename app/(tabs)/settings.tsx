import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { Strings } from '@/src/constants/strings';
import { Spacing } from '@/src/constants/theme';
import { Title, Subtitle, Body, Caption, Card } from '@/src/components/ui';

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Title>{Strings.settings.title}</Title>
        </View>

        <View style={styles.section}>
          <Card>
            <Body>{Strings.settings.privacyNote}</Body>
          </Card>
        </View>

        <View style={styles.section}>
          <Subtitle>{Strings.settings.about}</Subtitle>
          <Card>
            <Body>Talkify v1.0.0</Body>
            <Caption>WhatsApp sohbet analiz uygulaması</Caption>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
});
