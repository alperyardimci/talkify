import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useWhatsAppParser } from '@/src/hooks/useWhatsAppParser';
import { useLLMAnalysis } from '@/src/hooks/useLLMAnalysis';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import { Strings } from '@/src/constants/strings';
import { Spacing, FontSize, FontWeight } from '@/src/constants/theme';
import { Title, Body, Button } from '@/src/components/ui';
import { FileUploader, ParseProgress as ParseProgressComponent, ChatPreview } from '@/src/components/chat';

const logo = require('@/assets/logo/logo.png');

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { pickAndParse } = useWhatsAppParser();
  const { runAnalysis } = useLLMAnalysis();
  const currentChat = useChatStore((s) => s.currentChat);
  const isAnalyzing = useAnalysisStore((s) => s.isAnalyzing);
  const parseProgress = useChatStore((s) => s.parseProgress);
  const fileName = useChatStore((s) => s.fileName);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.titleRow}>
            <Image source={logo} style={styles.logo} />
            <Title style={styles.appName}>{Strings.app.name}</Title>
          </View>
          <Body style={{ textAlign: 'center', color: colors.textSecondary }}>
            {Strings.app.tagline}
          </Body>
        </View>

        <FileUploader
          onPickFile={pickAndParse}
          fileName={fileName ?? undefined}
          isLoading={isLoading}
        />

        {currentChat && (
          <Button
            title={Strings.analysis.startAnalysis}
            onPress={() => {
              runAnalysis();
              router.push('/(tabs)/analysis');
            }}
            variant="primary"
            loading={isAnalyzing}
            style={styles.analyzeButton}
          />
        )}

        {parseProgress && parseProgress.stage !== 'done' && (
          <View style={styles.section}>
            <ParseProgressComponent progress={parseProgress} />
          </View>
        )}

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
            <Body style={{ color: colors.error }}>{error}</Body>
          </View>
        )}

        {currentChat && (
          <View style={styles.section}>
            <ChatPreview chat={currentChat} />
          </View>
        )}
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
  hero: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  section: {
    marginTop: Spacing.lg,
  },
  errorBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  analyzeButton: {
    marginTop: Spacing.md,
  },
});
