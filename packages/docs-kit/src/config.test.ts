import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { clearDocsConfigCache, defineDocsConfig, getDocsConfig, loadDocsConfig } from './config';

const temporaryRoots: string[] = [];

const createFixtureRoot = (configSource: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobedocs-config-test-'));
  temporaryRoots.push(root);
  writeFileSync(join(root, 'docs.config.ts'), configSource);
  return root;
};

afterEach(() => {
  clearDocsConfigCache();
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('defineDocsConfig', () => {
  it('returns the given config unchanged', () => {
    const config = defineDocsConfig({
      atomDirs: [{ dir: 'src' }],
      description: 'desc',
      navSections: {},
      siteUrl: 'https://example.test',
      title: 'Identity',
    });

    expect(config).toEqual({
      atomDirs: [{ dir: 'src' }],
      description: 'desc',
      navSections: {},
      siteUrl: 'https://example.test',
      title: 'Identity',
    });
  });
});

describe('getDocsConfig', () => {
  it('loads the default export of docs.config.ts at the given root', () => {
    const root = createFixtureRoot(`
      export default {
        atomDirs: [{ dir: 'src' }],
        description: 'Fixture description',
        navSections: { 'src/Button/index.mdx': 'Components' },
        siteUrl: 'https://example.test',
        title: 'Fixture Docs',
      };
    `);

    const config = getDocsConfig(root);

    expect(config.title).toBe('Fixture Docs');
    expect(config.description).toBe('Fixture description');
    expect(config.siteUrl).toBe('https://example.test');
    expect(config.atomDirs).toEqual([{ dir: 'src' }]);
    expect(config.navSections).toEqual({ 'src/Button/index.mdx': 'Components' });
  });

  it('resolves a config authored with defineDocsConfig', () => {
    const root = createFixtureRoot(`
      import { defineDocsConfig } from ${JSON.stringify(join(__dirname, 'config.ts'))};

      export default defineDocsConfig({
        atomDirs: [{ dir: 'src' }],
        description: 'desc',
        navSections: {},
        siteUrl: 'https://example.test',
        title: 'Wrapped',
      });
    `);

    expect(getDocsConfig(root).title).toBe('Wrapped');
  });

  it('caches the loaded config per root until the cache is cleared', () => {
    const root = createFixtureRoot(
      `export default { atomDirs: [], description: '', navSections: {}, siteUrl: 'https://a.test', title: 'A' };`,
    );

    const first = getDocsConfig(root);
    writeFileSync(
      join(root, 'docs.config.ts'),
      `export default { atomDirs: [], description: '', navSections: {}, siteUrl: 'https://b.test', title: 'B' };`,
    );
    const second = getDocsConfig(root);

    expect(second).toBe(first);
    expect(second.title).toBe('A');

    clearDocsConfigCache();
    const third = getDocsConfig(root);
    expect(third.title).toBe('B');
  });

  it('throws when docs.config.ts is missing at the given root', () => {
    const root = mkdtempSync(join(tmpdir(), 'lobedocs-config-test-missing-'));
    temporaryRoots.push(root);

    expect(() => getDocsConfig(root)).toThrow();
  });
});

describe('loadDocsConfig', () => {
  it('resolves the same config as getDocsConfig', async () => {
    const root = createFixtureRoot(
      `export default { atomDirs: [], description: '', navSections: {}, siteUrl: 'https://async.test', title: 'Async' };`,
    );

    const config = await loadDocsConfig(root);

    expect(config.title).toBe('Async');
    expect(config.siteUrl).toBe('https://async.test');
  });
});
