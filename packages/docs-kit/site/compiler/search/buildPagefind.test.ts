import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createPagefindBuilder, type PagefindNodeApi } from './buildPagefind';

let root: string;
let inputDirectory: string;
let outputDirectory: string;

beforeEach(() => {
  root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-pagefind-build-'));
  inputDirectory = path.resolve(root, 'stage');
  outputDirectory = path.resolve(inputDirectory, 'pagefind');
  mkdirSync(inputDirectory, { recursive: true });
});

afterEach(() => {
  rmSync(root, { force: true, recursive: true });
});

const createApi = (
  options: {
    addErrors?: readonly string[];
    closeError?: Error;
    createErrors?: readonly string[];
    deleteError?: Error;
    pageCount?: number;
    writeErrors?: readonly string[];
  } = {},
) => {
  const calls: string[] = [];
  const index = {
    addDirectory: vi.fn(async ({ path }: { path: string }) => {
      calls.push(`add:${path}`);
      return { errors: options.addErrors ?? [], page_count: options.pageCount ?? 0 };
    }),
    deleteIndex: vi.fn(async () => {
      calls.push('delete');
      if (options.deleteError) throw options.deleteError;
      return null;
    }),
    writeFiles: vi.fn(async ({ outputPath }: { outputPath: string }) => {
      calls.push(`write:${outputPath}`);
      mkdirSync(outputPath, { recursive: true });
      return { errors: options.writeErrors ?? [], outputPath };
    }),
  };
  const api = {
    close: vi.fn(async () => {
      calls.push('close');
      if (options.closeError) throw options.closeError;
      return null;
    }),
    createIndex: vi.fn(async () => {
      calls.push('create');
      return { errors: options.createErrors ?? [], index };
    }),
  } as unknown as PagefindNodeApi;

  return { api, calls, index };
};

it('indexes the staged directory, writes output, and cleans the native service', async () => {
  const { api, calls } = createApi();
  const buildPagefind = createPagefindBuilder(async () => api);

  await buildPagefind({ inputDirectory, outputDirectory });

  expect(calls).toEqual([
    'create',
    expect.stringMatching(/^add:.+lobe-ui-pagefind-input-/),
    `write:${outputDirectory}`,
    'delete',
    'close',
  ]);
  expect(existsSync(calls[1].slice('add:'.length))).toBe(false);
});

it.each([
  ['createIndex', { createErrors: ['cannot create index'] }],
  ['addDirectory', { addErrors: ['invalid HTML'] }],
  ['writeFiles', { writeErrors: ['cannot write output'] }],
] as const)('turns %s errors arrays into an actionable build failure', async (stage, options) => {
  const { api, calls } = createApi(options);
  const buildPagefind = createPagefindBuilder(async () => api);

  await expect(buildPagefind({ inputDirectory, outputDirectory })).rejects.toThrow(
    new RegExp(`${stage}.*${Object.values(options)[0]?.[0]}`, 'is'),
  );
  expect(calls.at(-2)).toBe('delete');
  expect(calls.at(-1)).toBe('close');
});

it('aggregates primary and cleanup failures without hiding either cause', async () => {
  const { api } = createApi({
    closeError: new Error('service close failed'),
    deleteError: new Error('index cleanup failed'),
    writeErrors: ['write failed'],
  });
  const buildPagefind = createPagefindBuilder(async () => api);

  await expect(buildPagefind({ inputDirectory, outputDirectory })).rejects.toThrow(
    /writeFiles.*write failed[\s\S]*deleteIndex.*index cleanup failed[\s\S]*close.*service close failed/i,
  );
});

it('uses the real Pagefind service to opt in only documentation bodies', async () => {
  mkdirSync(path.resolve(inputDirectory, 'components/button'), { recursive: true });
  mkdirSync(path.resolve(inputDirectory, '~demos/example'), { recursive: true });
  writeFileSync(
    path.resolve(inputDirectory, 'components/button/index.html'),
    '<html><body><article data-pagefind-body>Button documentation</article></body></html>',
  );
  writeFileSync(
    path.resolve(inputDirectory, '~demos/example/index.html'),
    '<html><body>Standalone demo must not be indexed</body></html>',
  );
  const buildPagefind = createPagefindBuilder(() => import('pagefind'));

  await buildPagefind({ inputDirectory, outputDirectory });

  expect(
    JSON.parse(readFileSync(path.resolve(outputDirectory, 'pagefind-audit.json'), 'utf8')),
  ).toEqual({
    pageCount: 1,
    routes: ['/components/button'],
    schemaVersion: 1,
  });
});

it('writes an auditable receipt for exactly the indexable document routes', async () => {
  mkdirSync(path.resolve(inputDirectory, 'components/button'), { recursive: true });
  mkdirSync(path.resolve(inputDirectory, '~demos/example'), { recursive: true });
  writeFileSync(
    path.resolve(inputDirectory, 'components/button/index.html'),
    '<html><body><article data-pagefind-body>Button</article></body></html>',
  );
  writeFileSync(
    path.resolve(inputDirectory, '~demos/example/index.html'),
    '<html><body>Standalone demo</body></html>',
  );
  const { api } = createApi({ pageCount: 1 });
  const buildPagefind = createPagefindBuilder(async () => api);

  await buildPagefind({ inputDirectory, outputDirectory });

  expect(
    JSON.parse(readFileSync(path.resolve(outputDirectory, 'pagefind-audit.json'), 'utf8')),
  ).toEqual({
    pageCount: 1,
    routes: ['/components/button'],
    schemaVersion: 1,
  });
});

it('fails when Pagefind page count differs from the indexable HTML route set', async () => {
  writeFileSync(
    path.resolve(inputDirectory, 'index.html'),
    '<html><body><main data-pagefind-body>Home</main></body></html>',
  );
  const { api } = createApi({ pageCount: 0 });
  const buildPagefind = createPagefindBuilder(async () => api);

  await expect(buildPagefind({ inputDirectory, outputDirectory })).rejects.toThrow(
    /page count.*0.*1 indexable/i,
  );
});
