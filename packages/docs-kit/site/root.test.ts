import { getThemeCss } from '@lobehub/ui';
import { expect, it } from 'vitest';

import { links, loader } from './root';

vi.mock('@lobehub/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@lobehub/ui')>();
  return { ...actual, getThemeCss: vi.fn(actual.getThemeCss) };
});

it('publishes favicon link tags for browsers and Apple devices', async () => {
  const descriptors = await links();

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { href: '/favicon.ico', rel: 'icon', sizes: 'any' },
      { href: '/favicon-16x16.png', rel: 'icon', sizes: '16x16', type: 'image/png' },
      { href: '/favicon-32x32.png', rel: 'icon', sizes: '32x32', type: 'image/png' },
      { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180' },
    ]),
  );
});

it('changes the theme stylesheet cache key only when its CSS changes', () => {
  const initial = loader().themeStylesheetHref;

  expect(initial).toMatch(/^\/theme-vars\.css\?v=[\da-f]+$/);
  expect(loader().themeStylesheetHref).toBe(initial);

  vi.mocked(getThemeCss).mockReturnValueOnce(`${getThemeCss()}\n:root { --test-theme: 1; }`);
  expect(loader().themeStylesheetHref).not.toBe(initial);
  expect(loader().themeStylesheetHref).toBe(initial);
});
