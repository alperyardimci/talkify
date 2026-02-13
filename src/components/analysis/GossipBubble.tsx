import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Body, Caption } from '@/src/components/ui';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/src/constants/theme';

interface GossipBubbleProps {
  text: string;
  name: string;
}

export function GossipBubble({ text, name }: GossipBubbleProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.bubble, { backgroundColor: colors.gossipBubble }]}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{'\uD83D\uDCAC'}</Text>
          <Text
            style={[styles.name, { color: colors.gossipText }]}
          >
            {name}
          </Text>
        </View>
        <Text style={[styles.text, { color: colors.gossipText }]}>
          {text}
        </Text>
      </View>
      {/* Bubble tail */}
      <View
        style={[styles.tail, { borderTopColor: colors.gossipBubble }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bubble: {
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
    padding: Spacing.md,
    maxWidth: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: FontSize.lg,
    marginRight: Spacing.xs,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  text: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * 1.5,
  },
  tail: {
    width: 0,
    height: 0,
    marginLeft: Spacing.md,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
});
