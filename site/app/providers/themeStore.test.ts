import { afterEach, describe, expect, it, vi } from 'vitest';

import { createThemeStore, THEME_STORAGE_KEY } from './themeStore';

const createMedia = (initialMatches = false) => {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const media = {
    addEventListener: (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    removeEventListener: (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  } as MediaQueryList;

  return {
    matchMedia: vi.fn(() => media),
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches, media: media.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
};

const createStorage = (initialPreference?: string) => {
  const values = new Map<string, string>();
  if (initialPreference) values.set(THEME_STORAGE_KEY, initialPreference);

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
};

afterEach(() => {
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
});

describe('createThemeStore', () => {
  it('tracks system appearance without replacing the system preference', () => {
    const media = createMedia();
    const storage = createStorage();
    const store = createThemeStore({ matchMedia: media.matchMedia, storage });

    store.setPreference('system');
    media.setMatches(true);

    expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'system' });
    expect(storage.setItem).toHaveBeenLastCalledWith(THEME_STORAGE_KEY, 'system');
  });

  it('hydrates a valid stored preference and applies both document theme signals', () => {
    const media = createMedia(true);
    const store = createThemeStore({
      matchMedia: media.matchMedia,
      storage: createStorage('light'),
    });

    expect(store.getSnapshot()).toEqual({ appearance: 'light', preference: 'light' });
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('does not replace an explicit preference when system appearance changes', () => {
    const media = createMedia();
    const store = createThemeStore({ matchMedia: media.matchMedia, storage: createStorage() });

    store.setPreference('dark');
    media.setMatches(false);

    expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'dark' });
  });
});
