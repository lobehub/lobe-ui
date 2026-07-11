import { afterEach, describe, expect, it, vi } from 'vitest';

import { createThemeStore, THEME_STORAGE_KEY } from './themeStore';

const createMedia = (initialMatches = false) => {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const addEventListener = vi.fn(
    (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
  );
  const removeEventListener = vi.fn(
    (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  );
  const media = {
    addEventListener,
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    removeEventListener,
  } as unknown as MediaQueryList;

  return {
    addEventListener,
    matchMedia: vi.fn(() => media),
    removeEventListener,
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

const replaceWindowPropertyWithThrowingGetter = (
  property: 'localStorage' | 'matchMedia',
): (() => void) => {
  const descriptor = Object.getOwnPropertyDescriptor(window, property);
  Object.defineProperty(window, property, {
    configurable: true,
    get() {
      throw new DOMException(`${property} is unavailable`, 'SecurityError');
    },
  });

  return () => {
    if (descriptor) Object.defineProperty(window, property, descriptor);
    else delete (window as unknown as Record<string, unknown>)[property];
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

    const unsubscribe = store.subscribe(vi.fn());
    store.setPreference('system');
    media.setMatches(true);

    expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'system' });
    expect(storage.setItem).toHaveBeenLastCalledWith(THEME_STORAGE_KEY, 'system');
    unsubscribe();
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

  it('falls back to system when the browser storage getter throws and remains functional', () => {
    const restoreStorage = replaceWindowPropertyWithThrowingGetter('localStorage');

    try {
      const store = createThemeStore({ matchMedia: createMedia().matchMedia });
      expect(store.getSnapshot()).toEqual({ appearance: 'light', preference: 'system' });

      store.setPreference('dark');
      expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'dark' });
    } finally {
      restoreStorage();
    }
  });

  it('falls back to light system appearance when the matchMedia getter throws', () => {
    const restoreMatchMedia = replaceWindowPropertyWithThrowingGetter('matchMedia');

    try {
      const store = createThemeStore({ storage: createStorage() });
      expect(store.getSnapshot()).toEqual({ appearance: 'light', preference: 'system' });

      store.setPreference('dark');
      expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'dark' });
    } finally {
      restoreMatchMedia();
    }
  });

  it('owns the system media listener only while external subscribers exist', () => {
    const media = createMedia();
    const store = createThemeStore({ matchMedia: media.matchMedia, storage: createStorage() });

    expect(media.addEventListener).not.toHaveBeenCalled();

    const unsubscribeFirst = store.subscribe(vi.fn());
    const unsubscribeSecond = store.subscribe(vi.fn());
    expect(media.addEventListener).toHaveBeenCalledTimes(1);

    unsubscribeFirst();
    expect(media.removeEventListener).not.toHaveBeenCalled();
    unsubscribeSecond();
    expect(media.removeEventListener).toHaveBeenCalledTimes(1);

    media.setMatches(true);
    const unsubscribeResubscribed = store.subscribe(vi.fn());
    expect(media.addEventListener).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'system' });

    unsubscribeResubscribed();
    expect(media.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
