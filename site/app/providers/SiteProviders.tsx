import type { PropsWithChildren } from 'react';
import { createContext, use, useMemo, useSyncExternalStore } from 'react';

import {
  createThemeStore,
  SERVER_THEME_SNAPSHOT,
  type ThemePreference,
  type ThemeSnapshot,
} from './themeStore';

const siteThemeStore = createThemeStore();

export interface SiteThemeValue extends ThemeSnapshot {
  setPreference: (preference: ThemePreference) => void;
}

const SiteThemeContext = createContext<SiteThemeValue | null>(null);

export function useSiteTheme(): SiteThemeValue {
  const value = use(SiteThemeContext);
  if (!value) throw new Error('useSiteTheme must be used within SiteProviders');
  return value;
}

export default function SiteProviders({ children }: PropsWithChildren) {
  const snapshot = useSyncExternalStore(
    siteThemeStore.subscribe,
    siteThemeStore.getSnapshot,
    () => SERVER_THEME_SNAPSHOT,
  );
  const value = useMemo(
    () => ({ ...snapshot, setPreference: siteThemeStore.setPreference }),
    [snapshot],
  );

  return <SiteThemeContext value={value}>{children}</SiteThemeContext>;
}
