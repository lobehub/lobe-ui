import { expect, it } from 'vitest';

import { isStandaloneDemoPathname, links } from './root';

vi.mock('./app/content/registry', () => ({ contentManifest: { navigation: [] } }));

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

it('suppresses all documentation chrome for standalone demo routes', () => {
  expect(isStandaloneDemoPathname('/~demos/src-button-demo-demos')).toBe(true);
  expect(isStandaloneDemoPathname('/components/button')).toBe(false);
});
