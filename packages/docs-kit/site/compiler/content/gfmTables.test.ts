// @vitest-environment node

import { resolve } from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

const repositoryRoot = resolve(import.meta.dirname, '../../../../..');
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

const renderDocument = async (source: string) => {
  server = await createServer({
    configFile: resolve(repositoryRoot, 'packages/docs-kit/vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  const module = await server.ssrLoadModule(source);
  return renderToStaticMarkup(createElement(module.default));
};

it('compiles GFM markdown tables in component docs into real table markup', async () => {
  const html = await renderDocument('/src/base-ui/Popover/index.mdx');

  expect(html).toContain('<table>');
  expect(html).toContain('<thead>');
  expect(html).toContain('<tbody>');
  expect(html).toContain('contentLayoutAnimation');
  expect(html).toContain('disableDestroyOnInvalidTrigger');
  expect(html).not.toMatch(/\| Property\s+\| Description/);
}, 30_000);

it('preserves escaped pipes inside GFM table cells', async () => {
  const html = await renderDocument('/src/base-ui/Popover/index.mdx');

  expect(html).toContain('Omit&lt;PopoverProps, &#x27;children&#x27;');
  expect(html).toMatch(/defaultOpen/);
  expect(html).not.toMatch(/\| `Omit/);
}, 30_000);
