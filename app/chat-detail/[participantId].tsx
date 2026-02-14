import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { useStatistics } from '@/src/hooks/useStatistics';
import { useAnalysisStore } from '@/src/stores';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/src/constants/theme';
import { Subtitle, Body, Caption, Card, Badge } from '@/src/components/ui';
import { GossipBubble } from '@/src/components/analysis';
import { HourlyChart, EmojiCloud, TopWords } from '@/src/components/statistics';

export default function ParticipantDetailScreen() {
  const { colors } = useTheme();
  const s = useStrings();
  const { participantId } = useLocalSearchParams<{ participantId: string }>();
  const { statistics, getPatterns } = useStatistics();
  const analysisResult = useAnalysisStore((st) => st.analysisResult);

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
          <Body>{s.statistics.noData}</Body>
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
      {/* Header: Name + Nickname */}
      <View style={styles.header}>
        <Text style={[styles.headerName, { color: colors.text }]}>
          {participantStats.name}
        </Text>
        {participantAnalysis && (
          <Text style={[styles.headerNickname, { color: colors.primary }]}>
            {participantAnalysis.nickname}
          </Text>
        )}
      </View>

      {/* Compact Stats Row */}
      <Card>
        <View style={styles.compactStatsRow}>
          <View style={styles.compactStat}>
            <Text style={[styles.compactStatValue, { color: colors.text }]}>
              {participantStats.messageCount.toLocaleString('tr-TR')}
            </Text>
            <Text style={[styles.compactStatLabel, { color: colors.textSecondary }]}>
              {s.statistics.totalMessages}
            </Text>
          </View>
          <View style={[styles.compactStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.compactStat}>
            <Text style={[styles.compactStatValue, { color: colors.text }]}>
              {participantStats.wordCount.toLocaleString('tr-TR')}
            </Text>
            <Text style={[styles.compactStatLabel, { color: colors.textSecondary }]}>
              {s.statistics.totalWords}
            </Text>
          </View>
          <View style={[styles.compactStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.compactStat}>
            <Text style={[styles.compactStatValue, { color: colors.text }]}>
              {participantStats.emojiCount.toLocaleString('tr-TR')}
            </Text>
            <Text style={[styles.compactStatLabel, { color: colors.textSecondary }]}>
              {s.statistics.totalEmojis}
            </Text>
          </View>
          {participantStats.avgResponseTimeMinutes != null && (
            <>
              <View style={[styles.compactStatDivider, { backgroundColor: colors.border }]} />
              <View style={styles.compactStat}>
                <Text style={[styles.compactStatValue, { color: colors.text }]}>
                  {participantStats.avgResponseTimeMinutes >= 60
                    ? `${Math.round(participantStats.avgResponseTimeMinutes / 60)}`
                    : participantStats.avgResponseTimeMinutes < 1
                      ? '< 1'
                      : `${Math.round(participantStats.avgResponseTimeMinutes)}`}
                </Text>
                <Text style={[styles.compactStatLabel, { color: colors.textSecondary }]}>
                  {participantStats.avgResponseTimeMinutes >= 60
                    ? s.statistics.hours
                    : s.statistics.minutes}
                </Text>
              </View>
            </>
          )}
        </View>
      </Card>

      {/* Behavior Patterns */}
      {patterns.length > 0 && (
        <View style={styles.section}>
          <Subtitle>{s.statistics.behaviorPatterns}</Subtitle>
          <Card>
            <View style={styles.patternList}>
              {patterns.map((pattern) => (
                <View key={pattern.type} style={styles.patternItem}>
                  <View style={styles.patternHeader}>
                    <Badge
                      text={pattern.label}
                      icon={pattern.icon}
                      color={colors.primary}
                    />
                    <Text style={[styles.patternScore, { color: colors.textSecondary }]}>
                      {pattern.score}%
                    </Text>
                  </View>
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
            <Subtitle>{s.analysis.personality}</Subtitle>
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
            <Subtitle>{s.analysis.warning}</Subtitle>
            <Card style={{ backgroundColor: colors.warning + '20' }}>
              <Body>{participantAnalysis.warning}</Body>
            </Card>
          </View>
        </>
      )}

      {/* Top Words */}
      {participantStats.topWords.length > 0 && (
        <View style={styles.section}>
          <Subtitle>{s.statistics.topWords}</Subtitle>
          <Card>
            <TopWords words={participantStats.topWords} />
          </Card>
        </View>
      )}

      {/* Hourly Activity */}
      <View style={styles.section}>
        <Subtitle>{s.statistics.hourlyActivity}</Subtitle>
        <HourlyChart data={participantStats.hourlyActivity} />
      </View>

      {/* Emojis */}
      {participantStats.uniqueEmojis.length > 0 && (
        <View style={styles.section}>
          <Subtitle>{s.statistics.topEmojis}</Subtitle>
          <EmojiCloud emojis={participantStats.uniqueEmojis} />
        </View>
      )}
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
  header: {
    marginBottom: Spacing.sm,
    gap: 2,
  },
  headerName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  headerNickname: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  compactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  compactStatValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  compactStatLabel: {
    fontSize: FontSize.xs,
  },
  compactStatDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
  },
  section: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  patternList: {
    gap: Spacing.sm,
  },
  patternItem: {
    gap: 4,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternScore: {
    fontSize: FontSize.xs,
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
});
