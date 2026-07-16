// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { clearDocsConfigCache } from '../../src/config';
import { lobeDocsSiteConfigPlugin } from './vitePlugin';

const repositoryRoot = resolve(import.meta.dirname, '../../../..');
const defaultHomePagePath = resolve(
  repositoryRoot,
  'packages/docs-kit/site/components/Home/DefaultHome.tsx',
);
const temporaryRootParent = resolve(repositoryRoot, 'node_modules/.tmp-home-page-virtual-module');
mkdirSync(temporaryRootParent, { recursive: true });

const temporaryRoots: string[] = [];

const createFixtureConsumerRoot = (docsConfigBody: string): string => {
  const root = mkdtempSync(join(temporaryRootParent, 'fixture-'));
  temporaryRoots.push(root);
  writeFileSync(join(root, 'docs.config.ts'), docsConfigBody);
  return root;
};

const resolveHomePage = async (root: string): Promise<string | undefined> => {
  const plugin = lobeDocsSiteConfigPlugin(root);
  const resolveId =
    typeof plugin.resolveId === 'function' ? plugin.resolveId : plugin.resolveId?.handler;
  const resolved = await resolveId?.call({} as never, 'virtual:lobedocs/home-page', undefined, {
    attributes: {},
    isEntry: false,
  });
  if (typeof resolved === 'string') return resolved;
  return resolved ? resolved.id : undefined;
};

afterEach(() => {
  clearDocsConfigCache();
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('resolves to DefaultHome when homePage is unset', async () => {
  const root = createFixtureConsumerRoot(
    `export default {
      atomDirs: [{ dir: 'src' }],
      description: 'Fixture consumer without homePage.',
      navSections: {},
      siteUrl: 'https://fixture.example.test',
      title: 'Fixture Docs',
    };\n`,
  );

  await expect(resolveHomePage(root)).resolves.toBe(defaultHomePagePath);
});

it('resolves homePage to the consumer file when configured', async () => {
  const root = createFixtureConsumerRoot(
    `export default {
      atomDirs: [{ dir: 'src' }],
      description: 'Fixture consumer with homePage.',
      homePage: './docs/home/home.tsx',
      navSections: {},
      siteUrl: 'https://fixture.example.test',
      title: 'Fixture Docs',
    };\n`,
  );
  mkdirSync(join(root, 'docs/home'), { recursive: true });
  writeFileSync(
    join(root, 'docs/home/home.tsx'),
    'export default function Home() { return null; }\n',
  );

  await expect(resolveHomePage(root)).resolves.toBe(resolve(root, 'docs/home/home.tsx'));
});

it('throws naming the configured path when homePage does not exist', async () => {
  const root = createFixtureConsumerRoot(
    `export default {
      atomDirs: [{ dir: 'src' }],
      description: 'Fixture consumer with a missing homePage.',
      homePage: './docs/home/home.tsx',
      navSections: {},
      siteUrl: 'https://fixture.example.test',
      title: 'Fixture Docs',
    };\n`,
  );

  await expect(resolveHomePage(root)).rejects.toThrow(resolve(root, 'docs/home/home.tsx'));
});
