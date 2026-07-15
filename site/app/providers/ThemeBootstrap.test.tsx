import { afterEach, expect, it } from 'vitest';

import { STANDALONE_APPEARANCE_SCRIPT, THEME_INIT_SCRIPT } from './ThemeBootstrap';
import { THEME_STORAGE_KEY } from './themeConstants';

afterEach(() => {
  delete document.documentElement.dataset.standaloneAppearance;
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
  localStorage.removeItem(THEME_STORAGE_KEY);
  history.replaceState(null, '', '/');
});

it.each(['light', 'dark'] as const)(
  'marks an explicit standalone %s canvas before hydration',
  (appearance) => {
    history.replaceState(
      null,
      '',
      `/~demos/example?routeId=metadata%2Fonly&appearance=${appearance}`,
    );

    new Function(STANDALONE_APPEARANCE_SCRIPT)();

    expect(document.documentElement.dataset.standaloneAppearance).toBe(appearance);
  },
);

it('ignores appearance overrides outside standalone demo routes', () => {
  history.replaceState(null, '', '/components/button?appearance=dark');

  new Function(STANDALONE_APPEARANCE_SCRIPT)();

  expect(document.documentElement.dataset.standaloneAppearance).toBeUndefined();
});

it.each(['light', 'dark'] as const)(
  'applies an explicit %s theme preference before hydration',
  (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.dataset.theme).toBe(theme);
    expect(document.documentElement.style.colorScheme).toBe(theme);
  },
);

it('resolves system preference when storage is unset', () => {
  const previous = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: query.includes('dark'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
    onchange: null,
  })) as typeof window.matchMedia;

  try {
    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  } finally {
    if (previous) window.matchMedia = previous;
    else delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
  }
});
