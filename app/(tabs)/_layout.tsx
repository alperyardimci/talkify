import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useStrings } from '@/src/hooks/useStrings';

// Each tab has its own accent color
const TAB_COLORS = {
  home: '#6C5CE7',      // purple
  analysis: '#FD79A8',  // pink
  statistics: '#00CEC9', // teal
  settings: '#FDCB6E',  // yellow/amber
} as const;

function TabBarIcon({
  name,
  color,
  activeColor,
  focused,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  activeColor: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={22}
      name={name}
      color={focused ? activeColor : color}
      style={{ marginBottom: -2 }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const s = useStrings();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: s.tabs.home,
          headerShown: false,
          tabBarActiveTintColor: TAB_COLORS.home,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} activeColor={TAB_COLORS.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: s.tabs.analysis,
          headerShown: false,
          tabBarActiveTintColor: TAB_COLORS.analysis,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="magic" color={color} activeColor={TAB_COLORS.analysis} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: s.tabs.statistics,
          headerShown: false,
          tabBarActiveTintColor: TAB_COLORS.statistics,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bar-chart" color={color} activeColor={TAB_COLORS.statistics} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: s.tabs.settings,
          headerShown: false,
          tabBarActiveTintColor: TAB_COLORS.settings,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cog" color={color} activeColor={TAB_COLORS.settings} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
