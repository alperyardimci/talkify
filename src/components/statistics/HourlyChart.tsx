import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card } from '@/src/components/ui';
import {
  BorderRadius,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';
import type { HourlyActivity } from '@/src/types';

interface HourlyChartProps {
  data: HourlyActivity[];
}

const CHART_HEIGHT = 120;

export function HourlyChart({ data }: HourlyChartProps) {
  const { colors } = useTheme();

  // Reorder: 1-23 then 0 (midnight at end)
  const ordered = [...data.slice(1), data[0]];

  const maxCount = Math.max(...ordered.map((d) => d.count), 1);

  return (
    <Card>
      <View style={styles.chartContainer}>
        {/* Bars */}
        <View style={styles.barsRow}>
          {ordered.map((item) => {
            const barHeight = (item.count / maxCount) * CHART_HEIGHT;
            const isHighlighted = item.count === maxCount && item.count > 0;

            return (
              <View key={item.hour} style={styles.barWrapper}>
                <View style={[styles.barTrack, { height: CHART_HEIGHT }]}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(barHeight, 2),
                        backgroundColor: isHighlighted
                          ? colors.accent
                          : colors.primary,
                        opacity: isHighlighted ? 1 : 0.7,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Hour labels — every bar gets its hour */}
        <View style={styles.labelsRow}>
          {ordered.map((item) => (
            <View key={item.hour} style={styles.labelWrapper}>
              <Text
                style={[styles.label, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {String(item.hour).padStart(2, '0')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 1,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
    minWidth: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    gap: 1,
  },
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 7,
    fontWeight: FontWeight.medium,
  },
});
