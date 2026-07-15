import { expect, it } from 'vitest';

import { links } from './root';

const GEIST_FONT_STYLESHEET =
  'https://registry.npmmirror.com/@lobehub/webfont-geist/1.0.0/files/css/index.css';
const GEIST_MONO_FONT_STYLESHEET =
  'https://registry.npmmirror.com/@lobehub/webfont-geist-mono/1.0.0/files/css/index.css';

it('publishes the exact Geist font resources in the document head', async () => {
  const descriptors = await links();

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { crossOrigin: 'anonymous', href: 'https://registry.npmmirror.com', rel: 'preconnect' },
      { href: GEIST_FONT_STYLESHEET, rel: 'stylesheet' },
      { href: GEIST_MONO_FONT_STYLESHEET, rel: 'stylesheet' },
    ]),
  );
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

it('publishes antd and theme-vars stylesheets for pre-paint tokens', async () => {
  const descriptors = await links();

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { href: '/antd.css', rel: 'stylesheet' },
      { href: '/theme-vars.css', rel: 'stylesheet' },
    ]),
  );
});
