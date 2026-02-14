import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { useWhatsAppParser } from '@/src/hooks/useWhatsAppParser';
import { useChatStore } from '@/src/stores';
import { Spacing, FontSize, FontWeight } from '@/src/constants/theme';
import { Title, Body } from '@/src/components/ui';
import { FileUploader, ParseProgress as ParseProgressComponent, ChatPreview, GroupTitleHistory, ExportGuide } from '@/src/components/chat';

const logo = require('@/assets/logo/logo.png');

export default function HomeScreen() {
  const { colors } = useTheme();
  const s = useStrings();
  const { pickAndParse } = useWhatsAppParser();
  const currentChat = useChatStore((st) => st.currentChat);
  const parseProgress = useChatStore((st) => st.parseProgress);
  const fileName = useChatStore((st) => st.fileName);
  const isLoading = useChatStore((st) => st.isLoading);
  const error = useChatStore((st) => st.error);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.titleRow}>
            <Image source={logo} style={styles.logo} />
            <Title style={styles.appName}>{s.app.name}</Title>
          </View>
          <Body style={{ textAlign: 'center', color: colors.textSecondary }}>
            {s.app.tagline}
          </Body>
        </View>

        <FileUploader
          onPickFile={pickAndParse}
          fileName={fileName ?? undefined}
          isLoading={isLoading}
        />

        {!currentChat && !isLoading && (
          <View style={styles.section}>
            <ExportGuide />
          </View>
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

        {currentChat && currentChat.groupTitleHistory.length > 0 && (
          <View style={styles.section}>
            <GroupTitleHistory history={currentChat.groupTitleHistory} />
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
});
