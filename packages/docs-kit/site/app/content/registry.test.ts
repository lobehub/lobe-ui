// @vitest-environment node

import { resolve } from 'node:path';

import { createServer, type ViteDevServer } from 'vite';

const repositoryRoot = resolve(import.meta.dirname, '../../../../..');
let server: ViteDevServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

it('caches one React-compatible import promise per document pathname', async () => {
  server = await createServer({
    configFile: resolve(repositoryRoot, 'packages/docs-kit/vite.config.ts'),
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  const { loadDocument } = await server.ssrLoadModule(
    '/packages/docs-kit/site/app/content/registry.ts',
  );

  const first = loadDocument('/');
  const second = loadDocument('/');

  expect(second).toBe(first);

  await first;

  expect(first).toMatchObject({ status: 'fulfilled' });
});
