// @vitest-environment node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

import { styles as demoStyles } from '../../components/Demo/style';
import type { DocumentationInventory } from '../types';
import { extractComponentApi } from './extractComponent';

const repositoryRoot = resolve(import.meta.dirname, '../../../../..');
const documentPath = resolve(repositoryRoot, 'src/Button/index.mdx');
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

it('migrates the Button guide once while preserving both demos and the generated API request', () => {
  expect(existsSync(resolve(repositoryRoot, 'src/Button/index.md'))).toBe(false);
  const source = readFileSync(documentPath, 'utf8');
  const compatibility = JSON.parse(
    readFileSync(
      resolve(repositoryRoot, 'packages/docs-kit/site/content/compatibility.json'),
      'utf8',
    ),
  ) as DocumentationInventory;

  expect(source).toContain("import Basic from './demos/index.tsx?demo'");
  expect(source).toContain("import Variants from './demos/Variant.tsx?demo'");
  expect(source.match(/<Demo\b/g)).toHaveLength(2);
  expect(source).toContain('<Api name="Button" />');
  expect(
    compatibility.demoReferences
      .filter(({ pathname }) => pathname === '/components/button')
      .map(({ document }) => document),
  ).toEqual(['src/Button/index.mdx', 'src/Button/index.mdx']);
  expect(
    compatibility.documents.find(({ pathname }) => pathname === '/components/button')?.source,
  ).toBe('src/Button/index.mdx');
  expect(JSON.stringify(extractComponentApi({ documentPath, name: 'Button' }))).not.toContain(
    repositoryRoot,
  );
}, 15_000);

it('renders serialized Button properties and both canonical demo frames through Vite MDX', async () => {
  server = await createServer({
    configFile: resolve(repositoryRoot, 'vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  const module = await server.ssrLoadModule('/src/Button/index.mdx');
  const html = renderToStaticMarkup(createElement(module.default));

  expect(html).toContain('Button properties');
  expect(html).toContain('loading');
  expect(html.match(new RegExp(`class="${demoStyles.frame}"`, 'g'))).toHaveLength(2);
}, 15_000);
