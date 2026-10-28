import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

import { DEFAULT_WEB_FONTS, KATEX_CSS_VERSION } from './cdnAssets';

const minorOf = (version: string) => version.split('.').slice(0, 2).join('.');

describe('cdn assets', () => {
  it('loads the katex stylesheet for the installed katex minor', () => {
    const { version } = createRequire(import.meta.url)('katex/package.json') as { version: string };
    expect(minorOf(KATEX_CSS_VERSION)).toBe(minorOf(version));
  });

  it('ships webfonts for the families the default, code and simplified chinese stacks lead with', () => {
    const pkgs = DEFAULT_WEB_FONTS.map(({ pkg }) => pkg);
    expect(pkgs).toContain('@lobehub/webfont-geist');
    expect(pkgs).toContain('@lobehub/webfont-geist-mono');
    expect(pkgs).not.toContain('@lobehub/webfont-mono');
    expect(pkgs).toContain('@lobehub/webfont-harmony-sans');
    expect(pkgs).toContain('@lobehub/webfont-harmony-sans-sc');
  });
});
