import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { useLLMAnalysis } from '@/src/hooks/useLLMAnalysis';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import { Spacing } from '@/src/constants/theme';
import { Title, Subtitle, Body, Button, Card, ProgressBar } from '@/src/components/ui';
import { ParticipantCard, GossipBubble, AnalysisModeSelector } from '@/src/components/analysis';
import { SkeletonCard } from '@/src/components/analysis/SkeletonCard';
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
  const s = useStrings();
  const router = useRouter();
  const { runAnalysis } = useLLMAnalysis();
  const currentChat = useChatStore((st) => st.currentChat);
  const analysisResult = useAnalysisStore((st) => st.analysisResult);
  const isAnalyzing = useAnalysisStore((st) => st.isAnalyzing);
  const analysisProgress = useAnalysisStore((st) => st.analysisProgress);
  const analysisStatus = useAnalysisStore((st) => st.analysisStatus);
  const analysisError = useAnalysisStore((st) => st.error);
  const selectedMode = useAnalysisStore((st) => st.selectedMode);
  const setSelectedMode = useAnalysisStore((st) => st.setSelectedMode);

  const handleCopy = useCallback(async () => {
    if (!analysisResult || !currentChat) return;
    const text = formatAnalysisText(analysisResult, currentChat.chatName);
    await Clipboard.setStringAsync(text);
    Alert.alert(s.analysis.copied, s.analysis.copiedMessage);
  }, [analysisResult, currentChat, s]);

  if (!currentChat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.emptyState}>
          <Title>{s.analysis.title}</Title>
          <Body style={styles.emptyText}>{s.analysis.noData}</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Title style={{ flex: 1 }}>{s.analysis.title}</Title>
          {analysisResult && !isAnalyzing && (
            <Pressable onPress={handleCopy} style={styles.copyButton} hitSlop={8}>
              <FontAwesome name="copy" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {!analysisResult && !isAnalyzing && !analysisError && (
          <View style={styles.startSection}>
            <View style={styles.modeSection}>
              <Subtitle>{s.analysis.selectMode}</Subtitle>
              <AnalysisModeSelector
                selectedMode={selectedMode}
                onSelect={setSelectedMode}
              />
            </View>

            <Button
              title={s.analysis.startAnalysis}
              onPress={runAnalysis}
              variant="primary"
              disabled={isAnalyzing}
              loading={isAnalyzing}
            />
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.loadingSection}>
            <Card style={styles.progressCard}>
              <Body style={styles.analyzingText}>{s.analysis.analyzing}</Body>
              <ProgressBar progress={analysisProgress} label="" showPercentage />
              {analysisStatus && (
                <Body style={{ ...styles.statusText, color: colors.primary }}>
                  {analysisStatus}
                </Body>
              )}
            </Card>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        )}

        {analysisError && !isAnalyzing && (
          <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
            <Body style={{ color: colors.error }}>{analysisError}</Body>
            <Button
              title={s.analysis.retry}
              onPress={runAnalysis}
              variant="outline"
              disabled={isAnalyzing}
              loading={isAnalyzing}
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
              <Subtitle>{s.analysis.gossip}</Subtitle>
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
                <Subtitle>{s.analysis.groupDynamics}</Subtitle>
                <Card style={styles.groupCard}>
                  <Body>{analysisResult.group.summary}</Body>
                  <View style={styles.dynamicsSection}>
                    <Subtitle style={{ fontSize: 15 }}>{s.analysis.relationshipDynamics}</Subtitle>
                    <Body>{analysisResult.group.dynamics}</Body>
                  </View>
                  {analysisResult.group.funFacts.length > 0 && (
                    <View style={styles.funFacts}>
                      <Subtitle style={{ fontSize: 15 }}>
                        {s.analysis.funFacts}
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
              title={s.analysis.retry}
              onPress={runAnalysis}
              variant="outline"
              disabled={isAnalyzing}
              loading={isAnalyzing}
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
    gap: Spacing.md,
  },
  modeSection: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  loadingSection: {
    gap: Spacing.md,
  },
  progressCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  analyzingText: {
    textAlign: 'center',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 13,
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
