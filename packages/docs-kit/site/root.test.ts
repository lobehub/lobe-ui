import { expect, it } from 'vitest';

import { links } from './root';

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
