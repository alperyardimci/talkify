import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { useSettingsStore } from '@/src/stores';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/src/constants/theme';
import { Title, Subtitle, Body, Caption, Card } from '@/src/components/ui';
import type { Language } from '@/src/types';

const TIMEZONE_COUNTRIES = [
  { flag: '\uD83C\uDDF9\uD83C\uDDF7', name: 'Türkiye', offset: 3 },
  { flag: '\uD83C\uDDE9\uD83C\uDDEA', name: 'Almanya', offset: 1 },
  { flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'İngiltere', offset: 0 },
  { flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'ABD (Doğu)', offset: -5 },
  { flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'ABD (Batı)', offset: -8 },
  { flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'Fransa', offset: 1 },
  { flag: '\uD83C\uDDF3\uD83C\uDDF1', name: 'Hollanda', offset: 1 },
  { flag: '\uD83C\uDDE6\uD83C\uDDFF', name: 'Azerbaycan', offset: 4 },
  { flag: '\uD83C\uDDF8\uD83C\uDDE6', name: 'S. Arabistan', offset: 3 },
  { flag: '\uD83C\uDDE6\uD83C\uDDEA', name: 'BAE', offset: 4 },
  { flag: '\uD83C\uDDEF\uD83C\uDDF5', name: 'Japonya', offset: 9 },
  { flag: '\uD83C\uDDE6\uD83C\uDDFA', name: 'Avustralya', offset: 10 },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const s = useStrings();
  const language = useSettingsStore((st) => st.language);
  const timezoneOffset = useSettingsStore((st) => st.timezoneOffset);
  const setLanguage = useSettingsStore((st) => st.setLanguage);
  const setTimezoneOffset = useSettingsStore((st) => st.setTimezoneOffset);

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'tr', label: 'Türkçe' },
    { value: 'en', label: 'English' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Title>{s.settings.title}</Title>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Subtitle>{s.settings.languageSection}</Subtitle>
          <Card>
            <View style={styles.segmentedControl}>
              {languageOptions.map((opt) => {
                const isActive = language === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setLanguage(opt.value)}
                    style={[
                      styles.segment,
                      isActive && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: isActive ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Timezone */}
        <View style={styles.section}>
          <Subtitle>{s.settings.timezoneSection}</Subtitle>
          <Caption style={{ marginBottom: Spacing.xs }}>{s.settings.selectTimezone}</Caption>
          <Card>
            <View style={styles.timezoneGrid}>
              {TIMEZONE_COUNTRIES.map((country) => {
                const isActive = timezoneOffset === country.offset;
                return (
                  <Pressable
                    key={country.name}
                    onPress={() => setTimezoneOffset(country.offset)}
                    style={[
                      styles.timezoneChip,
                      {
                        backgroundColor: isActive ? colors.primary : colors.surfaceSecondary,
                        borderColor: isActive ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.timezoneFlag}>{country.flag}</Text>
                    <Text
                      style={[
                        styles.timezoneName,
                        { color: isActive ? '#FFFFFF' : colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {country.name}
                    </Text>
                    <Text
                      style={[
                        styles.timezoneOffset,
                        { color: isActive ? '#FFFFFF' + 'CC' : colors.textSecondary },
                      ]}
                    >
                      {`UTC${country.offset >= 0 ? '+' : ''}${country.offset}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Subtitle>{s.settings.llmSection}</Subtitle>
          <Card>
            <Body>{s.settings.privacyNote}</Body>
          </Card>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Subtitle>{s.settings.about}</Subtitle>
          <Card>
            <Body>Talkify v1.0.0</Body>
            <Caption>WhatsApp chat analysis app</Caption>
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
  segmentedControl: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  timezoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  timezoneChip: {
    width: '31%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  timezoneFlag: {
    fontSize: 20,
  },
  timezoneName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  timezoneOffset: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
});
