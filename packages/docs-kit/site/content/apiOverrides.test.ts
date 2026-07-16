// @vitest-environment node

import { existsSync } from 'node:fs';
import path from 'node:path';

import { apiOverrides } from './apiOverrides';

const root = path.resolve(import.meta.dirname, '../../../..');
const lobeUiSourcePrefix = 'https://github.com/lobehub/lobe-ui/tree/master/';
const approvedExternalSources = new Set([
  'https://github.com/lobehub/lobe-icons/tree/master/src/Cloudflare/index.ts',
  'https://github.com/lobehub/lobe-icons/tree/master/src/Github/index.ts',
]);

describe('reviewed API source overrides', () => {
  it('retains the reviewed Toast implementation link instead of its re-export barrel', () => {
    expect(apiOverrides['src/base-ui/Toast/index.mdx']?.sourceUrl).toBe(
      `${lobeUiSourcePrefix}src/base-ui/Toast/imperative.tsx`,
    );
  });

  it('covers exactly 79 final documents with live documentation and source links', () => {
    const entries = Object.entries(apiOverrides);
    const failures: string[] = [];

    expect(entries).toHaveLength(79);
    for (const [document, override] of entries) {
      const expectedDocUrl = `${lobeUiSourcePrefix}${document}`;
      if (!document.endsWith('/index.mdx')) failures.push(`${document}: key is not final MDX`);
      if (override.docUrl !== expectedDocUrl) failures.push(`${document}: docUrl mismatch`);
      if (!override.pkg.startsWith('@lobehub/ui/')) failures.push(`${document}: invalid package`);

      if (override.sourceUrl.startsWith(lobeUiSourcePrefix)) {
        const source = override.sourceUrl.slice(lobeUiSourcePrefix.length);
        if (!existsSync(path.resolve(root, source)))
          failures.push(`${document}: missing ${source}`);
      } else if (!approvedExternalSources.has(override.sourceUrl)) {
        failures.push(`${document}: unapproved external source`);
      }
    }

    expect(failures).toEqual([]);
  });
});
