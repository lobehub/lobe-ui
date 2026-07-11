import { afterEach, expect, it, vi } from 'vitest';

import { THEME_BOOTSTRAP_SCRIPT } from './ThemeBootstrap';
import { THEME_STORAGE_KEY } from './themeStore';

const replaceMatchMediaWithThrowingGetter = (): (() => void) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'matchMedia');
  Object.defineProperty(globalThis, 'matchMedia', {
    configurable: true,
    get() {
      throw new DOMException('matchMedia is unavailable', 'SecurityError');
    },
  });

  return () => {
    if (descriptor) Object.defineProperty(globalThis, 'matchMedia', descriptor);
    else delete (globalThis as unknown as Record<string, unknown>).matchMedia;
  };
};

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
  vi.unstubAllGlobals();
});

it.each(['light', 'dark'] as const)(
  'applies the stored %s preference without accessing matchMedia',
  (preference) => {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
    const restoreMatchMedia = replaceMatchMediaWithThrowingGetter();

    try {
      new Function(THEME_BOOTSTRAP_SCRIPT)();

      expect(document.documentElement.dataset.theme).toBe(preference);
      expect(document.documentElement.style.colorScheme).toBe(preference);
    } finally {
      restoreMatchMedia();
    }
  },
);

it('resolves system appearance without replacing the stored preference', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'system');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true })),
  );

  new Function(THEME_BOOTSTRAP_SCRIPT)();

  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
});

it('falls back to light without replacing system preference when matchMedia lookup throws', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'system');
  const restoreMatchMedia = replaceMatchMediaWithThrowingGetter();

  try {
    expect(() => new Function(THEME_BOOTSTRAP_SCRIPT)()).not.toThrow();

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  } finally {
    restoreMatchMedia();
  }
});

it('falls back to light without replacing system preference when matchMedia invocation throws', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'system');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => {
      throw new DOMException('matchMedia is unavailable', 'SecurityError');
    }),
  );

  expect(() => new Function(THEME_BOOTSTRAP_SCRIPT)()).not.toThrow();

  expect(document.documentElement.dataset.theme).toBe('light');
  expect(document.documentElement.style.colorScheme).toBe('light');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
});
