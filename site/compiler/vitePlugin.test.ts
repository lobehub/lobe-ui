// @vitest-environment node

import { resolve } from 'node:path';

import { createServer, type ViteDevServer } from 'vite';

const repositoryRoot = resolve(import.meta.dirname, '../..');
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

it('loads synchronous document metadata without compiling the MDX component', async () => {
  server = await createServer({
    configFile: resolve(repositoryRoot, 'vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  const module = await server.ssrLoadModule('/docs/index.mdx?document-metadata');

  expect(module.default).toMatchObject({
    pathname: '/',
    source: 'docs/index.mdx',
    title: 'LobeHub UI Kit',
  });
  expect(typeof module.default).toBe('object');
});
