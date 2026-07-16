import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { shouldUseChangelogFallback } from './changelogFallback';

const temporaryRoots: string[] = [];

const createFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-changelog-fallback-'));
  temporaryRoots.push(root);

  for (const [path, contents] of Object.entries(files)) {
    const absolutePath = join(root, path);
    mkdirSync(join(absolutePath, '..'), { recursive: true });
    writeFileSync(absolutePath, contents);
  }

  return root;
};

afterAll(() => {
  for (const root of temporaryRoots) rmSync(root, { force: true, recursive: true });
});

it('does not fall back when docs/changelog.mdx exists', () => {
  const root = createFixture({
    'CHANGELOG.md': '# Changelog\n',
    'docs/changelog.mdx': '# Changelog\n',
  });

  expect(shouldUseChangelogFallback(root)).toBe(false);
});

it('falls back to CHANGELOG.md when docs/changelog.mdx is absent', () => {
  const root = createFixture({ 'CHANGELOG.md': '# Changelog\n' });

  expect(shouldUseChangelogFallback(root)).toBe(true);
});

it('falls back to nothing when neither file exists', () => {
  const root = createFixture({});

  expect(shouldUseChangelogFallback(root)).toBe(false);
});
