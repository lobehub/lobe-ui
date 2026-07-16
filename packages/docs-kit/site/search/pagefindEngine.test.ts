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
      subResults: [{ pathname: '/components/button#keyboard-usage', title: 'Keyboard usage' }],
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

it('maps every usable sub-result, skips URL-less entries, and skips the page-root duplicate', async () => {
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({
      results: [
        {
          data: async () => ({
            meta: { title: 'Button' },
            plain_excerpt: 'Root excerpt',
            sub_results: [
              { plain_excerpt: 'Root again', title: 'Button', url: '/components/button' },
              {
                plain_excerpt: 'Usage details',
                title: 'Usage',
                url: '/components/button#usage',
              },
              { plain_excerpt: 'No URL', title: 'Orphan' },
              {
                plain_excerpt: 'Keyboard details',
                title: 'Keyboard usage',
                url: '/components/button#keyboard-usage',
              },
            ],
            url: '/components/button',
          }),
        },
      ],
    })),
  }));

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({
      subResults: [
        { pathname: '/components/button#usage', title: 'Usage' },
        { pathname: '/components/button#keyboard-usage', title: 'Keyboard usage' },
      ],
    }),
  ]);
});

it('omits subResults when no sub-result survives filtering', async () => {
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({
      results: [
        {
          data: async () => ({
            meta: { title: 'Button' },
            plain_excerpt: 'Root excerpt',
            sub_results: [
              { plain_excerpt: 'Root again', title: 'Button', url: '/components/button' },
              { plain_excerpt: 'No URL', title: 'Orphan' },
            ],
            url: '/components/button',
          }),
        },
      ],
    })),
  }));

  await expect(engine.search('button')).resolves.toEqual([
    expect.not.objectContaining({ subResults: expect.anything() }),
  ]);
});

it('resolves category from fragment meta over the resolveCategory fallback', async () => {
  const engine = createPagefindEngine(
    async () => ({
      init: vi.fn(async () => {}),
      preload: vi.fn(async () => {}),
      search: vi.fn(async () => ({
        results: [
          {
            data: async () => ({
              meta: { category: 'Actions', title: 'Button' },
              plain_excerpt: 'Excerpt',
              sub_results: [],
              url: '/components/button',
            }),
          },
        ],
      })),
    }),
    () => 'Fallback category',
  );

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ category: 'Actions' }),
  ]);
});

it('falls back to resolveCategory when fragment meta has no category', async () => {
  const engine = createPagefindEngine(
    async () => ({
      init: vi.fn(async () => {}),
      preload: vi.fn(async () => {}),
      search: vi.fn(async () => ({
        results: [
          {
            data: async () => ({
              meta: { title: 'Button' },
              plain_excerpt: 'Excerpt',
              sub_results: [],
              url: '/components/button',
            }),
          },
        ],
      })),
    }),
    (pathname) => (pathname === '/components/button' ? 'Actions' : undefined),
  );

  await expect(engine.search('button')).resolves.toEqual([
    expect.objectContaining({ category: 'Actions' }),
  ]);
});

it('leaves category undefined when both meta and resolveCategory are absent', async () => {
  const engine = createPagefindEngine(async () => ({
    init: vi.fn(async () => {}),
    preload: vi.fn(async () => {}),
    search: vi.fn(async () => ({
      results: [
        {
          data: async () => ({
            meta: { title: 'Button' },
            plain_excerpt: 'Excerpt',
            sub_results: [],
            url: '/components/button',
          }),
        },
      ],
    })),
  }));

  const [hit] = await engine.search('button');
  expect(hit?.category).toBeUndefined();
});
