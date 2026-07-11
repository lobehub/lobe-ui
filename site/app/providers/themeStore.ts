export type ThemePreference = 'light' | 'system' | 'dark';
export type ResolvedAppearance = 'light' | 'dark';

export interface ThemeSnapshot {
  appearance: ResolvedAppearance;
  preference: ThemePreference;
}

export interface ThemeStore {
  getSnapshot: () => ThemeSnapshot;
  setPreference: (preference: ThemePreference) => void;
  subscribe: (listener: () => void) => () => void;
}

interface ThemeStoreOptions {
  matchMedia?: (query: string) => MediaQueryList;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
}

export const THEME_STORAGE_KEY = 'lobe-ui-docs-theme';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const SERVER_THEME_SNAPSHOT: ThemeSnapshot = {
  appearance: 'light',
  preference: 'system',
};

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === 'light' || value === 'system' || value === 'dark';

const resolveAppearance = (
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedAppearance => {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
};

const readPreference = (storage?: Pick<Storage, 'getItem'>): ThemePreference => {
  if (!storage) return 'system';

  try {
    const storedPreference = storage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : 'system';
  } catch {
    return 'system';
  }
};

const applyAppearance = (appearance: ResolvedAppearance): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = appearance;
  document.documentElement.style.colorScheme = appearance;
};

const getBrowserMatchMedia = (): ((query: string) => MediaQueryList) | undefined => {
  if (typeof window === 'undefined') return;
  try {
    return window.matchMedia?.bind(window);
  } catch {
    return;
  }
};

const getBrowserStorage = (): Storage | undefined => {
  if (typeof window === 'undefined') return;
  try {
    return window.localStorage;
  } catch {
    return;
  }
};

export function createThemeStore(options: ThemeStoreOptions = {}): ThemeStore {
  const matchMedia = options.matchMedia ?? getBrowserMatchMedia();
  const storage = options.storage ?? getBrowserStorage();
  const media = matchMedia?.(THEME_MEDIA_QUERY);
  const listeners = new Set<() => void>();
  let preference = readPreference(storage);
  let snapshot: ThemeSnapshot = {
    appearance: resolveAppearance(preference, media?.matches ?? false),
    preference,
  };

  const updateSnapshot = (nextPreference: ThemePreference): void => {
    const nextSnapshot: ThemeSnapshot = {
      appearance: resolveAppearance(nextPreference, media?.matches ?? false),
      preference: nextPreference,
    };
    if (
      nextSnapshot.appearance === snapshot.appearance &&
      nextSnapshot.preference === snapshot.preference
    ) {
      applyAppearance(nextSnapshot.appearance);
      return;
    }

    snapshot = nextSnapshot;
    applyAppearance(snapshot.appearance);
    listeners.forEach((listener) => listener());
  };

  const handleSystemChange = (): void => {
    if (preference === 'system') updateSnapshot(preference);
  };

  let isMediaListening = false;

  const attachMediaListener = (): void => {
    if (!media || isMediaListening) return;
    media.addEventListener('change', handleSystemChange);
    isMediaListening = true;
    updateSnapshot(preference);
  };

  const detachMediaListener = (): void => {
    if (!media || !isMediaListening) return;
    media.removeEventListener('change', handleSystemChange);
    isMediaListening = false;
  };

  applyAppearance(snapshot.appearance);

  return {
    getSnapshot: () => snapshot,
    setPreference(nextPreference) {
      preference = nextPreference;
      try {
        storage?.setItem(THEME_STORAGE_KEY, nextPreference);
      } catch {
        // Theme selection remains functional when storage is unavailable.
      }
      updateSnapshot(nextPreference);
    },
    subscribe(listener) {
      const isFirstSubscriber = listeners.size === 0;
      listeners.add(listener);
      if (isFirstSubscriber) attachMediaListener();

      return () => {
        if (!listeners.delete(listener)) return;
        if (listeners.size === 0) detachMediaListener();
      };
    },
  };
}
