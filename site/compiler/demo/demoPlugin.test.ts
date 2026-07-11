// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { createLogger, createServer, type Plugin, type ViteDevServer } from 'vite';

import type { DemoModule } from '../../types/demo';
import { demoPlugin } from './demoPlugin';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
let server: ViteDevServer | undefined;
const temporaryRoots: string[] = [];

const writeFixture = (root: string, path: string, contents: string): string => {
  const absolutePath = resolve(root, path);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents);
  return absolutePath;
};

const createTemporaryProject = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-demo-plugin-'));
  temporaryRoots.push(root);
  for (const [path, contents] of Object.entries(files)) writeFixture(root, path, contents);
  return root;
};

const compatibilitySource = (legacyId: string, legacyRouteId: string) =>
  `${JSON.stringify(
    {
      demoReferences: [
        {
          document: 'docs/index.mdx',
          legacyId,
          legacyRouteId,
          options: { inline: false, isolated: false, layout: 'default' },
          pathname: '/',
          source: 'demo.tsx',
        },
      ],
      documents: [],
    },
    null,
    2,
  )}\n`;

const waitForValue = async <T>(read: () => Promise<T | undefined>): Promise<T> => {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    const value = await read();
    if (value !== undefined) return value;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20));
  }
  throw new Error('Timed out waiting for Vite HMR state');
};

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
  (globalThis as any).__lobeDemoEmptyImportLog = [];
  (globalThis as any).__lobeDemoExecutionLog = [];
  (globalThis as any).__lobeDemoScopeLog = [];
});

afterEach(async () => {
  await server?.close();
  server = undefined;
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
  delete (globalThis as any).__lobeDemoEmptyImportLog;
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

it('preserves empty JavaScript imports as editable-scope side effects', async () => {
  const descriptor = await loadDescriptor('/tests/fixtures/site/demos/empty-import-entry.js?demo');

  expect((globalThis as any).__lobeDemoEmptyImportLog).toEqual([]);

  await descriptor.loadScope();

  expect((globalThis as any).__lobeDemoEmptyImportLog).toEqual(['empty-import-helper']);
  expect((globalThis as any).__lobeDemoExecutionLog).toEqual([]);
});

it('preserves every frozen alias by source, including repeated and punctuation-bearing IDs', async () => {
  const repeated = await loadDescriptor('/src/DropdownMenu/demos/index.tsx?demo');
  const punctuated = await loadDescriptor('/src/mdx/Cards/demos/index.tsx?demo');

  expect(repeated.legacyIds).toEqual([
    'src-dropdown-menu-demo-demos',
    'src-base-ui-dropdown-menu-demo-demos',
  ]);
  expect(repeated.routeId).toBe('');
  expect(punctuated.legacyIds).toEqual(['cards, card-demo-demos']);
});

it('does not execute browser-only entries during descriptor evaluation or hide editability', async () => {
  const descriptor = await loadDescriptor('/tests/fixtures/site/demos/browser-only.tsx?demo');

  expect(descriptor.editable).toBe(true);
  expect((globalThis as any).__lobeDemoExecutionLog).toEqual([]);
});

it('selects route metadata from each importing MDX document for a shared demo source', async () => {
  const rootImporter = resolve(repositoryRoot, 'src/DropdownMenu/index.mdx');
  const baseImporter = resolve(repositoryRoot, 'src/base-ui/DropdownMenu/index.mdx');
  const importers = new Map([
    ['virtual:root-dropdown-demo', rootImporter],
    ['virtual:base-dropdown-demo', baseImporter],
  ]);
  const contextualImporters: Plugin = {
    load(id) {
      if (id !== rootImporter && id !== baseImporter) return;
      return `import demo from '/src/DropdownMenu/demos/index.tsx?demo'; export default demo;`;
    },
    name: 'contextual-demo-importers',
    resolveId(id) {
      return importers.get(id);
    },
  };
  server = await createServer({
    configFile: false,
    logLevel: 'silent',
    plugins: [contextualImporters, demoPlugin({ root: repositoryRoot })],
    root: repositoryRoot,
    server: { middlewareMode: true },
  });

  const rootDescriptor = (await server.ssrLoadModule('virtual:root-dropdown-demo'))
    .default as DemoModule;
  const baseDescriptor = (await server.ssrLoadModule('virtual:base-dropdown-demo'))
    .default as DemoModule;

  expect(rootDescriptor.routeId).toBe('components/DropdownMenu/index');
  expect(baseDescriptor.routeId).toBe('components/base-ui/DropdownMenu/index');
  expect(baseDescriptor.legacyIds).toEqual(rootDescriptor.legacyIds);
});

it('refreshes descriptor, scope, diagnostics, and compatibility metadata across Vite HMR', async () => {
  const initialEntry = `import { helperValue } from './barrel';
export const sourceMarker = 'initial-entry';
export default () => helperValue;
`;
  const updatedEntry = `import { helperValue } from './barrel';
import { secondaryValue } from './secondary';
export const sourceMarker = 'updated-entry';
export default () => helperValue + secondaryValue;
`;
  const safeHelper = (value: string) => `export const helperValue = '${value}';\n`;
  const dynamicHelper = (value: string) => `${safeHelper(value)}
export const loadHelper = () => import('./secondary');
`;
  const root = createTemporaryProject({
    'barrel.ts': "export { helperValue } from './helper';\n",
    'compatibility.json': compatibilitySource('legacy-initial', 'docs/initial'),
    'demo.tsx': initialEntry,
    'helper.ts': safeHelper('first'),
    'secondary.ts': "export const secondaryValue = 'second';\n",
  });
  const compatibilityPath = resolve(root, 'compatibility.json');
  const entryPath = resolve(root, 'demo.tsx');
  const helperPath = resolve(root, 'helper.ts');
  const logger = createLogger('silent');
  const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  const diagnosticWarnings = () =>
    warn.mock.calls.filter(([message]) => String(message).includes('editable={false}')).length;
  server = await createServer({
    configFile: false,
    customLogger: logger,
    plugins: [demoPlugin({ compatibilityPath, root })],
    root,
    server: { middlewareMode: true },
  });
  const loadCurrentDescriptor = async () =>
    (await server!.ssrLoadModule('/demo.tsx?demo')).default as DemoModule;
  const changeFile = async (path: string, contents: string) => {
    const observed = new Promise<void>((resolveObserved, rejectObserved) => {
      const timeout = setTimeout(() => {
        server!.watcher.off('change', onChange);
        rejectObserved(new Error(`Timed out waiting for Vite watcher: ${path}`));
      }, 3000);
      const onChange = (changedPath: string) => {
        if (resolve(changedPath) !== resolve(path)) return;
        clearTimeout(timeout);
        server!.watcher.off('change', onChange);
        resolveObserved();
      };
      server!.watcher.on('change', onChange);
    });
    writeFileSync(path, contents);
    await observed;
  };

  const initialDescriptor = await loadCurrentDescriptor();
  expect(initialDescriptor.source).toContain('initial-entry');
  expect(await initialDescriptor.loadScope()).toMatchObject({ helperValue: 'first' });
  expect(diagnosticWarnings()).toBe(0);

  await changeFile(entryPath, updatedEntry);
  const entryDescriptor = await waitForValue(async () => {
    const descriptor = await loadCurrentDescriptor();
    if (!descriptor.source.includes('updated-entry')) return;
    const scope = await descriptor.loadScope();
    return scope.secondaryValue === 'second' ? descriptor : undefined;
  });
  expect(entryDescriptor.source).toContain('updated-entry');

  await changeFile(helperPath, dynamicHelper('changed'));
  const changedScope = await waitForValue(async () => {
    const descriptor = await loadCurrentDescriptor();
    const scope = await descriptor.loadScope();
    return scope.helperValue === 'changed' && diagnosticWarnings() === 1 ? scope : undefined;
  });
  expect(changedScope.helperValue).toBe('changed');

  await changeFile(helperPath, safeHelper('fixed'));
  await waitForValue(async () => {
    const scope = await (await loadCurrentDescriptor()).loadScope();
    return scope.helperValue === 'fixed' ? scope : undefined;
  });
  expect(diagnosticWarnings()).toBe(1);

  await changeFile(helperPath, dynamicHelper('reintroduced'));
  await waitForValue(async () => {
    const scope = await (await loadCurrentDescriptor()).loadScope();
    return scope.helperValue === 'reintroduced' && diagnosticWarnings() === 2 ? scope : undefined;
  });

  await changeFile(compatibilityPath, compatibilitySource('legacy-updated', 'docs/updated'));
  const metadataDescriptor = await waitForValue(async () => {
    const descriptor = await loadCurrentDescriptor();
    return descriptor.legacyIds[0] === 'legacy-updated' ? descriptor : undefined;
  });
  expect(metadataDescriptor.legacyIds).toEqual(['legacy-updated']);
  expect(metadataDescriptor.routeId).toBe('docs/updated');
}, 15_000);
