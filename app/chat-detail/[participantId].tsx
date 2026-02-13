import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useStatistics } from '@/src/hooks/useStatistics';
import { useAnalysisStore } from '@/src/stores';
import { Strings } from '@/src/constants/strings';
import { Spacing } from '@/src/constants/theme';
import { Title, Subtitle, Body, Caption, Card, Badge, StatCard } from '@/src/components/ui';
import { NicknameReveal, GossipBubble } from '@/src/components/analysis';
import { HourlyChart, EmojiCloud } from '@/src/components/statistics';

export default function ParticipantDetailScreen() {
  const { colors } = useTheme();
  const { participantId } = useLocalSearchParams<{ participantId: string }>();
  const { statistics, getPatterns } = useStatistics();
  const analysisResult = useAnalysisStore((s) => s.analysisResult);

  const participantStats = statistics?.participantStats.find(
    (p) => p.participantId === participantId
  );

  const participantAnalysis = analysisResult?.participants.find(
    (p) => p.participantId === participantId
  );

  if (!participantStats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Body>Katılımcı bulunamadı</Body>
        </View>
      </View>
    );
  }

  const patterns = getPatterns(participantStats);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Nickname Reveal */}
      {participantAnalysis && (
        <NicknameReveal
          nickname={participantAnalysis.nickname}
          name={participantAnalysis.name}
        />
      )}

      {/* Basic Stats */}
      <View style={styles.section}>
        <Subtitle>{participantStats.name}</Subtitle>
        <View style={styles.statsGrid}>
          <StatCard
            label={Strings.statistics.totalMessages}
            value={participantStats.messageCount.toLocaleString('tr-TR')}
            icon="💬"
            color={colors.primary}
          />
          <StatCard
            label={Strings.statistics.totalWords}
            value={participantStats.wordCount.toLocaleString('tr-TR')}
            icon="📝"
            color={colors.secondary}
          />
          <StatCard
            label={Strings.statistics.totalEmojis}
            value={participantStats.emojiCount.toLocaleString('tr-TR')}
            icon="😀"
            color={colors.accent}
          />
          {participantStats.avgResponseTimeMinutes != null && (
            <StatCard
              label={Strings.statistics.avgResponseTime}
              value={`${Math.round(participantStats.avgResponseTimeMinutes)} ${Strings.statistics.minutes}`}
              icon="⏱️"
              color={colors.warning}
            />
          )}
        </View>
      </View>

      {/* Behavior Patterns */}
      {patterns.length > 0 && (
        <View style={styles.section}>
          <Subtitle>🏷️ {Strings.statistics.behaviorPatterns}</Subtitle>
          <Card>
            <View style={styles.patternList}>
              {patterns.map((pattern) => (
                <View key={pattern.type} style={styles.patternItem}>
                  <Badge
                    text={pattern.label}
                    icon={pattern.icon}
                    color={colors.primary}
                  />
                  <Caption>{pattern.description}</Caption>
                  <View style={styles.scoreBar}>
                    <View
                      style={[
                        styles.scoreFill,
                        {
                          width: `${pattern.score}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>
      )}

      {/* Personality & Gossip */}
      {participantAnalysis && (
        <>
          <View style={styles.section}>
            <Subtitle>🧠 {Strings.analysis.personality}</Subtitle>
            <Card>
              <Body>{participantAnalysis.personality}</Body>
            </Card>
          </View>

          <View style={styles.section}>
            <GossipBubble
              name={participantAnalysis.name}
              text={participantAnalysis.gossip}
            />
          </View>

          <View style={styles.section}>
            <Subtitle>⚠️ {Strings.analysis.warning}</Subtitle>
            <Card style={{ backgroundColor: colors.warning + '20' }}>
              <Body>{participantAnalysis.warning}</Body>
            </Card>
          </View>
        </>
      )}

      {/* Hourly Activity */}
      <View style={styles.section}>
        <Subtitle>⏰ {Strings.statistics.hourlyActivity}</Subtitle>
        <HourlyChart data={participantStats.hourlyActivity} />
      </View>

      {/* Emojis */}
      {participantStats.uniqueEmojis.length > 0 && (
        <View style={styles.section}>
          <Subtitle>😀 {Strings.statistics.topEmojis}</Subtitle>
          <EmojiCloud emojis={participantStats.uniqueEmojis} />
        </View>
      )}

      {/* Fun Messages */}
      <View style={styles.section}>
        <Subtitle>📖 Öne Çıkan Mesajlar</Subtitle>
        <Card>
          <View style={styles.messageSection}>
            <Caption>En uzun mesaj:</Caption>
            <Body numberOfLines={4}>
              "{participantStats.longestMessage}"
            </Body>
          </View>
          {participantStats.shortestMessage && (
            <View style={styles.messageSection}>
              <Caption>En kısa mesaj:</Caption>
              <Body>"{participantStats.shortestMessage}"</Body>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  patternList: {
    gap: Spacing.md,
  },
  patternItem: {
    gap: Spacing.xs,
  },
  scoreBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 2,
  },
  messageSection: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
});
