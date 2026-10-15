import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

import { KATEX_CSS_VERSION } from './cdnAssets';

const minorOf = (version: string) => version.split('.').slice(0, 2).join('.');

describe('cdn assets', () => {
  it('loads the katex stylesheet for the installed katex minor', () => {
    const { version } = createRequire(import.meta.url)('katex/package.json') as { version: string };
    expect(minorOf(KATEX_CSS_VERSION)).toBe(minorOf(version));
  });
});
