import ConfigProvider from '@lobehub/ui/ConfigProvider';
import LobeThemeProvider from '@lobehub/ui/ThemeProvider';
import { motion } from 'motion/react';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import type { PropsWithChildren } from 'react';

import { StyleRegistry } from './StyleRegistry';

export type ThemePreference = 'light' | 'system' | 'dark';
export type ResolvedAppearance = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'lobe-ui-docs-theme';

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
  const { appearance } = useSiteTheme();

  return (
    <ConfigProvider motion={motion}>
      <LobeThemeProvider
        appId="lobe-docs-site"
        appearance={appearance}
        enableCustomFonts={false}
        enableGlobalStyle={false}
      >
        {children}
      </LobeThemeProvider>
    </ConfigProvider>
  );
}

export function SiteProviders({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="data-theme" storageKey={THEME_STORAGE_KEY}>
      <StyleRegistry>
        <LibraryProviders>{children}</LibraryProviders>
      </StyleRegistry>
    </NextThemeProvider>
  );
}
