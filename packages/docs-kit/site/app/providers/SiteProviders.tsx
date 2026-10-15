import { ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import { type PropsWithChildren, useEffect, useState } from 'react';
import siteConfig from 'virtual:lobedocs/site-config';

import { THEME_STORAGE_KEY } from './themeConstants';

export type ThemePreference = 'light' | 'system' | 'dark';
export type ResolvedAppearance = 'light' | 'dark';

export { THEME_STORAGE_KEY };

export interface SiteThemeValue {
  appearance: ResolvedAppearance;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export function useSiteTheme(): SiteThemeValue {
  const { forcedTheme, resolvedTheme, setTheme, theme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const configuredTheme = siteConfig.themeConfig?.prefersColor;
  const configuredAppearance =
    configuredTheme === 'dark' || configuredTheme === 'light' ? configuredTheme : undefined;
  const fallbackAppearance =
    forcedTheme === 'dark' || forcedTheme === 'light'
      ? forcedTheme
      : (configuredAppearance ?? 'light');
  const resolvedAppearance =
    resolvedTheme === 'dark' || resolvedTheme === 'light' ? resolvedTheme : fallbackAppearance;

  return {
    appearance: hydrated ? resolvedAppearance : fallbackAppearance,
    preference: theme === 'light' || theme === 'dark' ? theme : (configuredAppearance ?? 'system'),
    setPreference: setTheme,
  };
}

function LibraryProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider enableCustomFonts={false} motion={motion}>
      {children}
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
      <LibraryProviders>{children}</LibraryProviders>
    </NextThemeProvider>
  );
}
