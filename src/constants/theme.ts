// ============================================
// Talkify - Theme Constants
// ============================================

export const Colors = {
  light: {
    primary: '#6C5CE7',
    primaryLight: '#A29BFE',
    secondary: '#00CEC9',
    accent: '#FD79A8',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F5',
    text: '#2D3436',
    textSecondary: '#636E72',
    textTertiary: '#B2BEC3',
    border: '#DFE6E9',
    error: '#D63031',
    success: '#00B894',
    warning: '#FDCB6E',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarInactive: '#B2BEC3',
    gossipBubble: '#FFF3E0',
    gossipText: '#E65100',
    nicknameBg: '#EDE7F6',
    nicknameText: '#4527A0',
  },
  dark: {
    primary: '#A29BFE',
    primaryLight: '#6C5CE7',
    secondary: '#00CEC9',
    accent: '#FD79A8',
    background: '#1A1A2E',
    surface: '#16213E',
    surfaceSecondary: '#0F3460',
    text: '#EAEAEA',
    textSecondary: '#A0A0A0',
    textTertiary: '#636E72',
    border: '#2D3436',
    error: '#FF6B6B',
    success: '#00B894',
    warning: '#FDCB6E',
    card: '#16213E',
    tabBar: '#16213E',
    tabBarInactive: '#636E72',
    gossipBubble: '#3E2723',
    gossipText: '#FFB74D',
    nicknameBg: '#311B92',
    nicknameText: '#D1C4E9',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export type ThemeColors = typeof Colors.light;
