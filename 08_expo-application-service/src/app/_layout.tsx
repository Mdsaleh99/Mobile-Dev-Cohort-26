import { ThemeProvider, type Theme } from '@react-navigation/native';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { UpdateBanner } from '@/components/update-banner';
import { Colors } from '@/constants/theme';

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.accent,
    background: Colors.dark.background,
    card: Colors.dark.backgroundElement,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

export default function TabLayout() {
  return (
    <ThemeProvider value={darkTheme}>
      <AnimatedSplashOverlay />
      <UpdateBanner />
      <AppTabs />
    </ThemeProvider>
  );
}
