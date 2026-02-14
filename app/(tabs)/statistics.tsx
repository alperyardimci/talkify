import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import { useStatistics } from '@/src/hooks/useStatistics';
import { useChatStore, useSettingsStore } from '@/src/stores';
import { Spacing } from '@/src/constants/theme';
import { Title, Subtitle, Body } from '@/src/components/ui';
import { StatsSummary, HourlyChart, EmojiCloud, ParticipantList, DuoResponseTime } from '@/src/components/statistics';
import { calculateDuoResponseTimes } from '@/src/services/analytics/statisticsEngine';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const s = useStrings();
  const router = useRouter();
  const currentChat = useChatStore((st) => st.currentChat);
  const timezoneOffset = useSettingsStore((st) => st.timezoneOffset);
  const { statistics, recalculate } = useStatistics();

  useEffect(() => {
    if (currentChat && !statistics) {
      recalculate();
    }
  }, [currentChat, statistics, recalculate]);

  const duoStats = currentChat ? calculateDuoResponseTimes(currentChat, timezoneOffset) : null;

  if (!currentChat || !statistics) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.emptyState}>
          <Title>{s.statistics.title}</Title>
          <Body style={styles.emptyText}>{s.statistics.noData}</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Title>{s.statistics.title}</Title>
        </View>

        <StatsSummary statistics={statistics} />

        {duoStats && (
          <View style={styles.section}>
            <Subtitle>{s.statistics.duoResponseTime}</Subtitle>
            <DuoResponseTime stats={duoStats} />
          </View>
        )}

        {statistics.topEmojis.length > 0 && (
          <View style={styles.section}>
            <Subtitle>{s.statistics.topEmojis}</Subtitle>
            <EmojiCloud emojis={statistics.topEmojis} />
          </View>
        )}

        <View style={styles.section}>
          <Subtitle>{s.statistics.participants}</Subtitle>
          <ParticipantList
            stats={statistics.participantStats}
            onPress={(participantId) =>
              router.push(`/chat-detail/${participantId}`)
            }
          />
        </View>

        <View style={styles.section}>
          <Subtitle>{s.statistics.hourlyActivity}</Subtitle>
          <HourlyChart data={statistics.hourlyHeatmap} />
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
    marginBottom: Spacing.md,
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
  section: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
});
