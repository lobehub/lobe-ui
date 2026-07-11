import { afterEach, expect, it, vi } from 'vitest';

import { THEME_BOOTSTRAP_SCRIPT } from './ThemeBootstrap';
import { THEME_STORAGE_KEY } from './themeStore';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
  vi.unstubAllGlobals();
});

it('applies the shared stored preference before hydration', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false })),
  );

  new Function(THEME_BOOTSTRAP_SCRIPT)();

  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(document.documentElement.style.colorScheme).toBe('dark');
});

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
