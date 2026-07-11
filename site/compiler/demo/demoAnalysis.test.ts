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
