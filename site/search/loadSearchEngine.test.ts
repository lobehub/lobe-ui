import { deferred } from '../tests/deferred';
import type { DocumentManifestEntry } from '../types/content';
import {
  createBrowserPagefindLoader,
  createResilientSearchEngine,
  disposeSearchEngine,
  handlePagefindHmr,
  loadSearchEngine,
  resetSearchEngine,
} from './loadSearchEngine';

const documents: DocumentManifestEntry[] = [
  {
    category: 'Actions',
    description: 'Primary action control.',
    pathname: '/components/button',
    source: 'src/Button/index.mdx',
    title: 'Button',
  },
];

const pagefindHit = {
  meta: { title: 'Button from Pagefind' },
  plain_excerpt: 'Indexed excerpt',
  sub_results: [],
  url: '/components/button',
};

const workingModule = () => ({
  destroy: vi.fn(async () => {}),
  init: vi.fn(async () => {}),
  preload: vi.fn(async () => {}),
  search: vi.fn(async () => ({ results: [{ data: async () => pagefindHit }] })),
});

it.each(['import', 'init', 'preload', 'search', 'fragment'] as const)(
  'latches deterministic manifest fallback after a %s failure',
  async (stage) => {
    const module = workingModule();
    const load = vi.fn(async () => {
      if (stage === 'import') throw new Error('import failed');
      if (stage === 'init') module.init.mockRejectedValueOnce(new Error('init failed'));
      if (stage === 'preload') module.preload.mockRejectedValueOnce(new Error('preload failed'));
      if (stage === 'search') module.search.mockRejectedValueOnce(new Error('search failed'));
      if (stage === 'fragment') {
        module.search.mockResolvedValueOnce({
          results: [
            {
              data: async () => {
                throw new Error('fragment failed');
              },
            },
          ],
        });
      }
      return module;
    });
    const engine = createResilientSearchEngine({ documents, loadPagefind: load });

    if (stage === 'preload') await engine.preload('button');
    else await engine.search('button');
    await expect(engine.search('button')).resolves.toEqual([
      expect.objectContaining({ pathname: '/components/button', title: 'Button' }),
    ]);

    expect(load).toHaveBeenCalledTimes(1);
  },
);

it('disposes, resets, and retries a previously rejected import after HMR', async () => {
  const first = vi.fn(async () => {
    throw new Error('not generated yet');
  });
  const second = vi.fn(async () => workingModule());
  const loaders = [first, second];
  const engine = createResilientSearchEngine({
    documents,
    loadPagefind: () => loaders[0]!(),
  });

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button' }),
  ]);
  loaders.shift();
  await engine.reset?.();
  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button from Pagefind' }),
  ]);
  await engine.dispose?.();
});

it('resets the singleton in place so held and reopened consumers share one facade', async () => {
  const first = loadSearchEngine(documents, async () => workingModule());
  await first.init();
  await resetSearchEngine();
  const second = loadSearchEngine(documents, async () => workingModule());

  expect(second).toBe(first);
  await disposeSearchEngine();
});

it('resets a held singleton facade so an open dialog retries after HMR', async () => {
  let available = false;
  const load = vi.fn(async () => {
    if (!available) throw new Error('not generated yet');
    return workingModule();
  });
  const held = loadSearchEngine(documents, load);

  await expect(held.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button' }),
  ]);
  available = true;
  await resetSearchEngine();

  await expect(held.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button from Pagefind' }),
  ]);
  expect(load).toHaveBeenCalledTimes(2);
  await disposeSearchEngine();
});

it('changes the browser module URL after reset so a rejected import is not cached', async () => {
  const importModule = vi.fn(async (_specifier: string) => workingModule());
  const load = createBrowserPagefindLoader(importModule);

  await load();
  await resetSearchEngine();
  await load();

  expect(importModule).toHaveBeenCalledTimes(2);
  expect(importModule.mock.calls[0]?.[0]).not.toBe(importModule.mock.calls[1]?.[0]);
  expect(importModule.mock.calls[1]?.[0]).toMatch(/^\/pagefind\/pagefind\.js\?hmr=\d+$/);
});

it('does not let an old rejected search latch fallback after a reset', async () => {
  const oldResponse = deferred<{ results: [] }>();
  const oldSearch = vi.fn(() => oldResponse.promise);
  const modules = [
    {
      destroy: vi.fn(async () => {}),
      init: vi.fn(async () => {}),
      preload: vi.fn(async () => {}),
      search: oldSearch,
    },
    workingModule(),
  ];
  const load = vi.fn(async () => modules.shift()!);
  const engine = createResilientSearchEngine({ documents, loadPagefind: load });

  const oldSearchResult = engine.search('button');
  await vi.waitFor(() => expect(oldSearch).toHaveBeenCalledOnce());
  const reset = engine.reset();
  oldResponse.reject(new Error('stale search failed'));
  await expect(oldSearchResult).resolves.toEqual([expect.objectContaining({ title: 'Button' })]);
  await reset;

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button from Pagefind' }),
  ]);
  expect(load).toHaveBeenCalledTimes(2);
});

it('holds fresh operations behind the reset barrier until the old module is disposed', async () => {
  const oldResponse = deferred<{ results: [] }>();
  const oldSearch = vi.fn(() => oldResponse.promise);
  const freshModule = workingModule();
  const modules = [
    {
      destroy: vi.fn(async () => {}),
      init: vi.fn(async () => {}),
      preload: vi.fn(async () => {}),
      search: oldSearch,
    },
    freshModule,
  ];
  const engine = createResilientSearchEngine({
    documents,
    loadPagefind: vi.fn(async () => modules.shift()!),
  });
  const oldOperation = engine.search('button');
  await vi.waitFor(() => expect(oldSearch).toHaveBeenCalledOnce());

  const reset = engine.reset();
  const freshOperation = engine.search('button');
  await Promise.resolve();
  expect(freshModule.init).not.toHaveBeenCalled();

  oldResponse.resolve({ results: [] });
  await oldOperation;
  await reset;
  await expect(freshOperation).resolves.toEqual([
    expect.objectContaining({ title: 'Button from Pagefind' }),
  ]);
  expect(freshModule.init).toHaveBeenCalledOnce();
});

it('catches HMR cleanup rejection while leaving the reset facade retryable', async () => {
  const cleanupError = new Error('destroy failed');
  const modules = [
    {
      ...workingModule(),
      destroy: vi.fn(async () => {
        throw cleanupError;
      }),
    },
    workingModule(),
  ];
  const engine = loadSearchEngine(documents, async () => modules.shift()!);
  await engine.init();
  const onError = vi.fn();

  handlePagefindHmr(onError);
  await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(cleanupError));

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ title: 'Button from Pagefind' }),
  ]);
  await disposeSearchEngine();
});
