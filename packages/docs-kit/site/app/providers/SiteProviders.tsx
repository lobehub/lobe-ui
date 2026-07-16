import ConfigProvider from '@lobehub/ui/ConfigProvider';
import LobeThemeProvider from '@lobehub/ui/ThemeProvider';
import type { ThemeMode } from 'antd-style';
import { motion } from 'motion/react';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import type { PropsWithChildren } from 'react';
import siteConfig from 'virtual:lobedocs/site-config';

import { StyleRegistry } from './StyleRegistry';
import { THEME_STORAGE_KEY } from './themeConstants';
import { cssVarTokenOverrides } from './themeCssVars';

export type ThemePreference = 'light' | 'system' | 'dark';
export type ResolvedAppearance = 'light' | 'dark';

export { THEME_STORAGE_KEY };

export interface SiteThemeValue {
  appearance: ResolvedAppearance;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export function useSiteTheme(): SiteThemeValue {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return {
    appearance: resolvedTheme === 'dark' ? 'dark' : 'light',
    preference: theme === 'light' || theme === 'dark' ? theme : 'system',
    setPreference: setTheme,
  };
}

function LibraryProviders({ children }: PropsWithChildren) {
  const { forcedTheme, theme } = useTheme();
  const mode = forcedTheme ?? theme;
  const themeMode: ThemeMode = mode === 'dark' || mode === 'light' ? mode : 'auto';

  return (
    <ConfigProvider motion={motion}>
      <LobeThemeProvider
        appId="lobe-docs-site"
        customToken={() => cssVarTokenOverrides}
        defaultAppearance={forcedTheme === 'dark' ? 'dark' : 'light'}
        enableCustomFonts={false}
        enableGlobalStyle={false}
        themeMode={themeMode}
      >
        {children}
      </LobeThemeProvider>
    </ConfigProvider>
  );
}

export function SiteProviders({ children }: PropsWithChildren) {
  const prefersColor = siteConfig.themeConfig?.prefersColor ?? 'auto';
  const defaultTheme = prefersColor === 'auto' ? 'system' : prefersColor;
  const forcedTheme = prefersColor === 'auto' ? undefined : prefersColor;

  return (
    <NextThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute="data-theme"
      defaultTheme={defaultTheme}
      forcedTheme={forcedTheme}
      storageKey={THEME_STORAGE_KEY}
    >
      <StyleRegistry>
        <LibraryProviders>{children}</LibraryProviders>
      </StyleRegistry>
    </NextThemeProvider>
  );
}
