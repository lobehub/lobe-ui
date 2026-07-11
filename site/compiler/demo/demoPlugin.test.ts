// @vitest-environment node

import { resolve } from 'node:path';

import { createServer, type ViteDevServer } from 'vite';

import type { DemoModule } from '../../types/demo';
import { demoPlugin } from './demoPlugin';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
let server: ViteDevServer | undefined;

const loadDescriptor = async (source: string): Promise<DemoModule> => {
  server ??= await createServer({
    configFile: false,
    logLevel: 'silent',
    plugins: [demoPlugin({ root: repositoryRoot })],
    root: repositoryRoot,
    server: { middlewareMode: true },
  });

  const module = await server.ssrLoadModule(source);
  return module.default as DemoModule;
};

beforeEach(() => {
  (globalThis as any).__lobeDemoExecutionLog = [];
  (globalThis as any).__lobeDemoScopeLog = [];
});

afterEach(async () => {
  await server?.close();
  server = undefined;
  delete (globalThis as any).__lobeDemoExecutionLog;
  delete (globalThis as any).__lobeDemoScopeLog;
});

it('keeps the canonical demo and editable dependency scope independently lazy', async () => {
  const descriptor = await loadDescriptor('/tests/fixtures/site/demos/simple.tsx?demo');

  expect((globalThis as any).__lobeDemoExecutionLog).toEqual([]);
  expect((globalThis as any).__lobeDemoScopeLog).toEqual([]);

  await descriptor.load();

  expect((globalThis as any).__lobeDemoExecutionLog).toEqual(['simple']);
  expect((globalThis as any).__lobeDemoScopeLog).toEqual([]);
});

it('loads the editable scope without evaluating the selected demo entry', async () => {
  const descriptor = await loadDescriptor('/tests/fixtures/site/demos/local-import.tsx?demo');

  await descriptor.loadScope();

  expect((globalThis as any).__lobeDemoExecutionLog).toEqual([]);
  expect((globalThis as any).__lobeDemoScopeLog).toEqual(['helper']);
});

it('preserves every frozen alias by source, including repeated and punctuation-bearing IDs', async () => {
  const repeated = await loadDescriptor('/src/DropdownMenu/demos/index.tsx?demo');
  const punctuated = await loadDescriptor('/src/mdx/Cards/demos/index.tsx?demo');

  expect(repeated.legacyIds).toEqual([
    'src-dropdown-menu-demo-demos',
    'src-base-ui-dropdown-menu-demo-demos',
  ]);
  expect(punctuated.legacyIds).toEqual(['cards, card-demo-demos']);
});

it('does not execute browser-only entries during descriptor evaluation or hide editability', async () => {
  const descriptor = await loadDescriptor('/tests/fixtures/site/demos/browser-only.tsx?demo');

  expect(descriptor.editable).toBe(true);
  expect((globalThis as any).__lobeDemoExecutionLog).toEqual([]);
});
