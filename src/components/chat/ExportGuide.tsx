import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';

type TabPlatform = 'ios' | 'android';

export function ExportGuide() {
  const { colors } = useTheme();
  const s = useStrings();

  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabPlatform>(
    Platform.OS === 'android' ? 'android' : 'ios',
  );

  const animValue = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(animValue, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded((prev) => !prev);
  };

  const bodyHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  const chevronRotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const steps = activeTab === 'ios' ? s.guide.iosSteps : s.guide.androidSteps;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable style={styles.header} onPress={toggle}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          {'\u2753'} {s.guide.title}
        </Text>
        <Animated.Text
          style={[
            styles.chevron,
            { color: colors.textSecondary, transform: [{ rotate: chevronRotate }] },
          ]}
        >
          {'\u25BE'}
        </Animated.Text>
      </Pressable>

      <Animated.View style={[styles.body, { maxHeight: bodyHeight }]}>
        <View style={styles.bodyInner}>
          {/* Platform tabs */}
          <View style={styles.tabRow}>
            {(['ios', 'android'] as TabPlatform[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? colors.primary : colors.surfaceSecondary,
                    },
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {tab === 'ios' ? s.guide.tabIos : s.guide.tabAndroid}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Steps */}
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
            </View>
          ))}

          {/* Privacy note */}
          <Text style={[styles.privacyNote, { color: colors.textTertiary }]}>
            {s.guide.privacyNote}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  headerText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  chevron: {
    fontSize: FontSize.xl,
  },
  body: {
    overflow: 'hidden',
  },
  bodyInner: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tab: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  stepText: {
    fontSize: FontSize.sm,
    flex: 1,
    lineHeight: FontSize.sm * 1.5,
  },
  privacyNote: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    lineHeight: FontSize.xs * 1.5,
  },
});
