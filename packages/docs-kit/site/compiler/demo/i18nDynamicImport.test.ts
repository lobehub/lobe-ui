// @vitest-environment node

import path from 'node:path';

import { load } from 'cheerio';
import { type ComponentType, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

const repositoryRoot = path.resolve(import.meta.dirname, '../../../../..');
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

it('renders the production dynamic-import demo through the read-only source contract', async () => {
  server = await createServer({
    configFile: path.resolve(repositoryRoot, 'vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  const module = (await server.ssrLoadModule('/src/i18n/index.mdx')) as {
    default: ComponentType;
  };
  const $ = load(renderToStaticMarkup(createElement(module.default)));
  const frame = $('section[aria-label="Demo: src/i18n/demos/DynamicImport.tsx"]');
  const toolbarLabels = frame
    .find('button')
    .toArray()
    .map((button) => $(button).text().trim());

  expect(frame).toHaveLength(1);
  expect(frame.attr('data-demo-editable')).toBe('false');
  expect(toolbarLabels).toContain('Show source');
  expect(toolbarLabels).not.toContain('Show source editor');
}, 30_000);
