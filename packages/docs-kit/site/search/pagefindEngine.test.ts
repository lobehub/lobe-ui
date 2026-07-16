import { deferred } from '../tests/deferred';
import { createPagefindEngine } from './pagefindEngine';

const fragment = (
  url: string,
  title: string,
  excerpt: string,
  subResults: Array<{ plain_excerpt: string; title: string; url: string }> = [],
) => ({
  meta: { title },
  plain_excerpt: excerpt,
  sub_results: subResults,
  url,
});

it('deduplicates initialization and forwards preload intent', async () => {
  const init = vi.fn(async () => {});
  const preload = vi.fn(async () => {});
  const engine = createPagefindEngine(async () => ({
    init,
    preload,
    search: vi.fn(async () => ({ results: [] })),
  }));

  await Promise.all([engine.init(), engine.init()]);
  await engine.preload('button');

  expect(init).toHaveBeenCalledTimes(1);
  expect(preload).toHaveBeenCalledWith('button');
});

it('loads only the bounded first result set in parallel', async () => {
  const releases = Array.from({ length: 12 }, () => deferred<ReturnType<typeof fragment>>());
  const data = Array.from({ length: 14 }, (_, index) =>
    vi.fn(() => releases[index]?.promise ?? Promise.resolve(fragment(`/ignored-${index}`, '', ''))),
  );
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({ results: data.map((load) => ({ data: load })) })),
  }));

  const pending = engine.search('component');
  await vi.waitFor(() =>
    expect(data.slice(0, 10).every((load) => load.mock.calls.length === 1)).toBe(true),
  );
  expect(data.slice(10).every((load) => load.mock.calls.length === 0)).toBe(true);

  releases
    .slice(0, 10)
    .forEach((release, index) =>
      release.resolve(fragment(`/components/${index}`, `Component ${index}`, `Excerpt ${index}`)),
    );
  await expect(pending).resolves.toHaveLength(10);
});

it('invalidates stale searches before and after fragment loading, including an empty query', async () => {
  const firstSearch = deferred<{
    results: Array<{ data: () => Promise<ReturnType<typeof fragment>> }>;
  }>();
  const firstFragment = deferred<ReturnType<typeof fragment>>();
  const thirdFragment = deferred<ReturnType<typeof fragment>>();
  let call = 0;
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(() => {
      call += 1;
      if (call === 1) return firstSearch.promise;
      if (call === 2) {
        return Promise.resolve({
          results: [{ data: async () => fragment('/components/button', 'Button', 'Current') }],
        });
      }
      return Promise.resolve({ results: [{ data: () => thirdFragment.promise }] });
    }),
  }));

  const staleBeforeFragments = engine.search('but');
  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ pathname: '/components/button', title: 'Button' }),
  ]);
  firstSearch.resolve({ results: [{ data: () => firstFragment.promise }] });
  await expect(staleBeforeFragments).resolves.toEqual([]);
  expect(firstFragment.settled).toBe(false);

  const staleAfterSearch = engine.search('old');
  await vi.waitFor(() => expect(call).toBe(3));
  await expect(engine.search('')).resolves.toEqual([]);
  thirdFragment.resolve(fragment('/components/old', 'Old', 'Old excerpt'));
  await expect(staleAfterSearch).resolves.toEqual([]);
});

it('prefers matching sub-results and exposes only plain excerpts as text', async () => {
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({
      results: [
        {
          data: async () =>
            fragment('/components/button', 'Button', '<mark>unsafe</mark>', [
              {
                plain_excerpt: '<img src=x onerror=alert(1)> keyboard usage',
                title: 'Keyboard usage',
                url: '/components/button#keyboard-usage',
              },
            ]),
        },
      ],
    })),
  }));

  await expect(engine.search('keyboard')).resolves.toEqual([
    {
      excerpt: '<img src=x onerror=alert(1)> keyboard usage',
      id: '/components/button#keyboard-usage',
      pathname: '/components/button#keyboard-usage',
      section: 'Keyboard usage',
      title: 'Button',
    },
  ]);
});

it('destroys a module whose deferred load resolves after disposal without reviving it', async () => {
  const createModule = () => ({
    destroy: vi.fn(async () => {}),
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({ results: [] })),
  });
  const loaded = deferred<ReturnType<typeof createModule>>();
  const module = createModule();
  const engine = createPagefindEngine(() => loaded.promise);

  const initialization = engine.init();
  const disposal = engine.dispose?.();
  loaded.resolve(module);
  await Promise.all([initialization, disposal]);

  expect(module.init).not.toHaveBeenCalled();
  expect(module.destroy).toHaveBeenCalledOnce();
});

it('destroys a candidate exactly once when initialization rejects and preserves the cause', async () => {
  const destroy = vi.fn(async () => {});
  const engine = createPagefindEngine(async () => ({
    destroy,
    init: vi.fn(async () => {
      throw new Error('initialization failed');
    }),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({ results: [] })),
  }));

  await expect(engine.init()).rejects.toThrow('initialization failed');
  expect(destroy).toHaveBeenCalledOnce();
});

it('waits for a pending search before destroying its module and invalidates the result', async () => {
  const response = deferred<{ results: [] }>();
  const destroy = vi.fn(async () => {});
  const searchModule = vi.fn(() => response.promise);
  const engine = createPagefindEngine(async () => ({
    destroy,
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: searchModule,
  }));

  const search = engine.search('button');
  await vi.waitFor(() => expect(searchModule).toHaveBeenCalledOnce());
  const disposal = engine.dispose?.();
  await Promise.resolve();
  expect(destroy).not.toHaveBeenCalled();

  response.resolve({ results: [] });
  await expect(search).resolves.toEqual([]);
  await disposal;
  expect(destroy).toHaveBeenCalledOnce();
});
