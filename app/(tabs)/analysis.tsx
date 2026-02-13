import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/hooks/useTheme';
import { useLLMAnalysis } from '@/src/hooks/useLLMAnalysis';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import { Strings } from '@/src/constants/strings';
import { Spacing, FontSize, FontWeight } from '@/src/constants/theme';
import { Title, Subtitle, Body, Button, Card, ProgressBar } from '@/src/components/ui';
import { ParticipantCard, GossipBubble } from '@/src/components/analysis';
import type { AnalysisResult } from '@/src/types';

function formatAnalysisText(result: AnalysisResult, chatName: string): string {
  let text = `Talkify Analiz - ${chatName}\n`;
  text += '='.repeat(30) + '\n\n';

  for (const p of result.participants) {
    text += `${p.name}\n`;
    text += `Lakap: ${p.nickname}\n`;
    text += `Kisilik: ${p.personality}\n`;
    text += `Dedikodu: ${p.gossip}\n`;
    text += `Uyari: ${p.warning}\n\n`;
  }

  if (result.group) {
    text += 'Grup Dinamikleri\n';
    text += '-'.repeat(20) + '\n';
    text += `${result.group.summary}\n\n`;
    text += `Iliskiler: ${result.group.dynamics}\n\n`;
    if (result.group.funFacts.length > 0) {
      text += 'Eglenceli Bilgiler:\n';
      for (const fact of result.group.funFacts) {
        text += `- ${fact}\n`;
      }
    }
  }

  return text;
}

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { runAnalysis } = useLLMAnalysis();
  const currentChat = useChatStore((s) => s.currentChat);
  const analysisResult = useAnalysisStore((s) => s.analysisResult);
  const isAnalyzing = useAnalysisStore((s) => s.isAnalyzing);
  const analysisProgress = useAnalysisStore((s) => s.analysisProgress);
  const analysisError = useAnalysisStore((s) => s.error);

  const handleCopy = useCallback(async () => {
    if (!analysisResult || !currentChat) return;
    const text = formatAnalysisText(analysisResult, currentChat.chatName);
    await Clipboard.setStringAsync(text);
    Alert.alert('Kopyalandi', 'Analiz sonuclari panoya kopyalandi.');
  }, [analysisResult, currentChat]);

  if (!currentChat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.emptyState}>
          <Title>{Strings.analysis.title}</Title>
          <Body style={styles.emptyText}>{Strings.analysis.noData}</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Title style={{ flex: 1 }}>{Strings.analysis.title}</Title>
          {analysisResult && !isAnalyzing && (
            <Pressable onPress={handleCopy} style={styles.copyButton} hitSlop={8}>
              <FontAwesome name="copy" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {!analysisResult && !isAnalyzing && !analysisError && (
          <View style={styles.startSection}>
            <Body style={{ textAlign: 'center', marginBottom: Spacing.sm }}>{Strings.analysis.subtitle}</Body>
            <Button
              title={Strings.analysis.startAnalysis}
              onPress={runAnalysis}
              variant="primary"
            />
          </View>
        )}

        {isAnalyzing && (
          <Card style={styles.progressCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Body style={styles.analyzingText}>{Strings.analysis.analyzing}</Body>
            <ProgressBar progress={analysisProgress} label="Ilerleme" showPercentage />
          </Card>
        )}

        {analysisError && !isAnalyzing && (
          <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
            <Body style={{ color: colors.error }}>{analysisError}</Body>
            <Button
              title={Strings.analysis.retry}
              onPress={runAnalysis}
              variant="outline"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        )}

        {analysisResult && !isAnalyzing && (
          <>
            {analysisResult.participants.map((participant) => (
              <ParticipantCard
                key={participant.participantId}
                analysis={participant}
                onPress={() =>
                  router.push(`/chat-detail/${participant.participantId}`)
                }
              />
            ))}

            <View style={styles.section}>
              <Subtitle>{Strings.analysis.gossip}</Subtitle>
              {analysisResult.participants.map((participant) => (
                <GossipBubble
                  key={participant.participantId}
                  name={participant.name}
                  text={participant.gossip}
                />
              ))}
            </View>

            {analysisResult.group && (
              <View style={styles.section}>
                <Subtitle>{Strings.analysis.groupDynamics}</Subtitle>
                <Card style={styles.groupCard}>
                  <Body>{analysisResult.group.summary}</Body>
                  <View style={styles.dynamicsSection}>
                    <Subtitle style={{ fontSize: 15 }}>İlişki Dinamikleri</Subtitle>
                    <Body>{analysisResult.group.dynamics}</Body>
                  </View>
                  {analysisResult.group.funFacts.length > 0 && (
                    <View style={styles.funFacts}>
                      <Subtitle style={{ fontSize: 15 }}>
                        {Strings.analysis.funFacts}
                      </Subtitle>
                      {analysisResult.group.funFacts.map((fact, i) => (
                        <Body key={i}>{fact}</Body>
                      ))}
                    </View>
                  )}
                </Card>
              </View>
            )}

            <Button
              title={Strings.analysis.retry}
              onPress={runAnalysis}
              variant="outline"
              style={styles.reanalyzeButton}
            />
          </>
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
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    padding: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  startSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  progressCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  analyzingText: {
    textAlign: 'center',
  },
  errorBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  groupCard: {
    gap: Spacing.md,
  },
  dynamicsSection: {
    gap: Spacing.xs,
  },
  funFacts: {
    gap: Spacing.xs,
  },
  reanalyzeButton: {
    marginTop: Spacing.xl,
  },
});
