// @vitest-environment node

import { resolve } from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

const repositoryRoot = resolve(import.meta.dirname, '../../../../..');
const nonBreakingSpace = ' ';
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

it('compiles a realistic changelog excerpt through the production mdx pipeline', async () => {
  server = await createServer({
    configFile: resolve(repositoryRoot, 'packages/docs-kit/vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  const module = await server.ssrLoadModule(
    '/tests/fixtures/site/content/changelog-realistic-excerpt.md',
  );
  const html = renderToStaticMarkup(createElement(module.default));

  expect(html).toContain('<details');
  expect(html).toContain('<summary');
  expect(html).toContain('<kbd');
  expect(html).toContain('<div align="right">');
  expect(html).toContain(`Version${nonBreakingSpace}4.20.2`);
  expect(html).toContain('strict: true');
  expect(html).toContain('Replace underline');
}, 30_000);
