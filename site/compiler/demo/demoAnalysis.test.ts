// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { analyzeDemo } from './demoAnalysis';

const fixtureRoot = resolve(import.meta.dirname, '../../../tests/fixtures/site/demos');
const temporaryRoots: string[] = [];

const createFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-demo-analysis-'));
  temporaryRoots.push(root);

  for (const [path, contents] of Object.entries(files)) {
    const absolutePath = resolve(root, path);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }

  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('accepts a supported local helper graph for editable scope loading', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'local-import.tsx'));

  expect(analysis.requiresReadOnly).toBe(false);
  expect(analysis.diagnostics).toEqual([]);
});

it('requires an authored read-only use for dynamic imports and browser workers', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'browser-only.tsx'));

  expect(analysis.requiresReadOnly).toBe(true);
  expect(analysis.diagnostics.map(({ code }) => code)).toEqual(
    expect.arrayContaining(['dynamic-import', 'browser-worker']),
  );
  expect(analysis.diagnostics.every(({ message }) => message.includes('editable={false}'))).toBe(
    true,
  );
});

it('classifies the explicit dynamic-import fixture as read-only', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'dynamic-import.tsx'));

  expect(analysis.requiresReadOnly).toBe(true);
  expect(analysis.diagnostics).toContainEqual(expect.objectContaining({ code: 'dynamic-import' }));
});

it('reports unsupported local dependency graphs instead of silently changing editability', () => {
  const root = createFixture({
    'demo.tsx': "import value from './missing.data';\nexport default () => <div>{value}</div>;\n",
  });
  const analysis = analyzeDemo(resolve(root, 'demo.tsx'));

  expect(analysis.requiresReadOnly).toBe(true);
  expect(analysis.diagnostics).toEqual([
    expect.objectContaining({
      code: 'unsupported-local-dependency',
      message: expect.stringContaining('editable={false}'),
    }),
  ]);
});

it('follows local runtime re-exports and exposes their dependency paths', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'reexport-entry.tsx'));

  expect(analysis.diagnostics).toContainEqual(
    expect.objectContaining({
      code: 'dynamic-import',
      sourcePath: expect.stringMatching(/reexport-helper\.ts$/),
    }),
  );
  expect(analysis.dependencyPaths).toEqual(
    expect.arrayContaining([
      resolve(fixtureRoot, 'reexport-barrel.ts'),
      resolve(fixtureRoot, 'reexport-helper.ts'),
    ]),
  );
});

it('reports an unresolved local runtime re-export at the barrel edge', () => {
  const root = createFixture({
    'barrel.ts': "export { missing } from './missing';\n",
    'demo.tsx': "import { missing } from './barrel';\nexport default () => <div>{missing}</div>;\n",
  });
  const analysis = analyzeDemo(resolve(root, 'demo.tsx'));

  expect(analysis.diagnostics).toContainEqual(
    expect.objectContaining({
      code: 'unsupported-local-dependency',
      line: 1,
      sourcePath: resolve(root, 'barrel.ts'),
    }),
  );
});

it('does not traverse type-only local re-exports', () => {
  const root = createFixture({
    'barrel.ts': "export type { Missing } from './missing';\n",
    'demo.tsx': "import type { Missing } from './barrel';\nexport default () => null;\n",
  });
  const analysis = analyzeDemo(resolve(root, 'demo.tsx'));

  expect(analysis.diagnostics).toEqual([]);
  expect(analysis.dependencyPaths).toEqual([]);
});

it('does not traverse non-empty named clauses whose elements are all type-only', () => {
  const root = createFixture({
    'barrel.ts': "export { type Missing } from './missing';\n",
    'demo.tsx': "import { type Missing } from './barrel';\nexport default () => null;\n",
  });
  const analysis = analyzeDemo(resolve(root, 'demo.tsx'));

  expect(analysis.diagnostics).toEqual([]);
  expect(analysis.dependencyPaths).toEqual([]);
});

it('treats an empty JavaScript import clause as a runtime dependency edge', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'empty-import-entry.js'));

  expect(analysis.diagnostics).toContainEqual(
    expect.objectContaining({
      code: 'dynamic-import',
      sourcePath: expect.stringMatching(/empty-import-helper\.js$/),
    }),
  );
  expect(analysis.dependencyPaths).toContain(resolve(fixtureRoot, 'empty-import-helper.js'));
});

it('treats an empty JavaScript re-export clause as a runtime dependency edge', () => {
  const analysis = analyzeDemo(resolve(fixtureRoot, 'empty-reexport-entry.js'));

  expect(analysis.diagnostics).toContainEqual(
    expect.objectContaining({
      code: 'browser-worker',
      sourcePath: expect.stringMatching(/empty-reexport-helper\.js$/),
    }),
  );
  expect(analysis.dependencyPaths).toEqual(
    expect.arrayContaining([
      resolve(fixtureRoot, 'empty-reexport-barrel.js'),
      resolve(fixtureRoot, 'empty-reexport-helper.js'),
    ]),
  );
});
