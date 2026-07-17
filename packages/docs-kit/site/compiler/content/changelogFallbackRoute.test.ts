// @vitest-environment node

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

import { lobeDocsSiteConfigPlugin } from '../vitePlugin';
import { createContentManifest } from './createManifest';
import { defaultAtomDirs } from './discoverDocuments';
import { createMdxPlugin } from './mdxPlugin';

const repositoryRoot = resolve(import.meta.dirname, '../../../../..');
const fixtureExcerptPath = resolve(
  repositoryRoot,
  'tests/fixtures/site/content/changelog-realistic-excerpt.md',
);
const mdxComponentsPath = resolve(repositoryRoot, 'packages/docs-kit/site/app/mdx-components.tsx');

let server: ViteDevServer | undefined;
const temporaryRoots: string[] = [];
// Nested under the repository's own node_modules so bare-specifier
// resolution (react/jsx-dev-runtime, etc.) walks up to the real install,
// the same as any consumer project would.
const temporaryRootParent = resolve(repositoryRoot, 'node_modules/.tmp-changelog-fallback-route');
mkdirSync(temporaryRootParent, { recursive: true });

const createFixtureConsumerRoot = (): string => {
  const root = mkdtempSync(join(temporaryRootParent, 'fixture-'));
  temporaryRoots.push(root);

  const changelogPath = join(root, 'CHANGELOG.md');
  mkdirSync(dirname(changelogPath), { recursive: true });
  writeFileSync(changelogPath, readFileSync(fixtureExcerptPath, 'utf8'));
  writeFileSync(
    join(root, 'docs.config.ts'),
    `export default {
      atomDirs: [{ dir: 'src' }],
      description: 'Fixture consumer without docs/changelog.mdx.',
      navSections: {},
      siteUrl: 'https://fixture.example.test',
      title: 'Fixture Docs',
    };\n`,
  );

  return root;
};

afterEach(async () => {
  await server?.close();
  server = undefined;
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('routes a consumer with no docs/changelog.mdx to /changelog via the CHANGELOG.md fallback', () => {
  const root = createFixtureConsumerRoot();
  expect(existsSync(resolve(root, 'docs/changelog.mdx'))).toBe(false);

  const manifest = createContentManifest(root, defaultAtomDirs, {});
  const changelog = manifest.documents.find((document) => document.pathname === '/changelog');

  expect(changelog).toMatchObject({
    description: 'Release history for this project.',
    pathname: '/changelog',
    source: 'CHANGELOG.md',
    title: 'Changelog',
  });
});

it('renders the realistic CHANGELOG.md fallback content for a fixture consumer without docs/changelog.mdx', async () => {
  const root = createFixtureConsumerRoot();

  server = await createServer({
    configFile: false,
    logLevel: 'silent',
    plugins: [lobeDocsSiteConfigPlugin(root), createMdxPlugin()],
    resolve: {
      alias: [
        {
          find: '/packages/docs-kit/site/app/mdx-components',
          replacement: mdxComponentsPath,
        },
        { find: '@lobehub/ui', replacement: resolve(repositoryRoot, 'src') },
        { find: '@', replacement: resolve(repositoryRoot, 'src') },
      ],
    },
    root,
    server: {
      fs: { allow: [repositoryRoot] },
      middlewareMode: true,
    },
    ssr: {
      noExternal: ['@lobehub/icons', '@lobehub/fluent-emoji'],
    },
  });

  const module = await server.ssrLoadModule('/CHANGELOG.md');
  const html = renderToStaticMarkup(createElement(module.default));

  expect(html).toContain('<details');
  expect(html).toContain('<summary');
  expect(html).toContain('strict: true');
}, 120_000);
