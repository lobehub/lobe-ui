import { act, renderHook } from '@testing-library/react';

import type { SearchEngine, SearchHit } from '../../search/types';
import { deferred } from '../../tests/deferred';
import type { DocumentManifestEntry } from '../../types/content';
import { useSearchQuery } from './useSearchQuery';

const documents: DocumentManifestEntry[] = [
  {
    category: 'Actions',
    description: 'Primary action control.',
    pathname: '/components/button',
    source: 'src/Button/index.mdx',
    title: 'Button',
  },
];

const hit = (title: string): SearchHit => ({
  category: 'Components',
  excerpt: '',
  id: title,
  pathname: `/components/${title.toLowerCase()}`,
  title,
});

const createEngine = (search: SearchEngine['search']): SearchEngine => ({
  init: vi.fn(async () => {}),
  preload: vi.fn(async () => {}),
  search: vi.fn(search),
});

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const advance = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

it('coalesces a burst of keystrokes into a single debounced search', async () => {
  const engine = createEngine(async () => [hit('Button')]);
  const loadEngine = () => engine;
  const { result } = renderHook(() => useSearchQuery({ documents, loadEngine, open: true }));

  act(() => result.current.search('b'));
  act(() => result.current.search('bu'));
  act(() => result.current.search('but'));

  expect(result.current.loading).toBe(true);
  expect(engine.search).not.toHaveBeenCalled();
  expect(engine.preload).toHaveBeenCalledTimes(3);

  await advance(150);

  expect(engine.search).toHaveBeenCalledTimes(1);
  expect(engine.search).toHaveBeenLastCalledWith('but');
  expect(result.current.hits).toHaveLength(1);
  expect(result.current.loading).toBe(false);
});

it('discards a stale in-flight search when a newer one resolves first', async () => {
  const first = deferred<SearchHit[]>();
  const second = deferred<SearchHit[]>();
  const queue = [first, second];
  const engine = createEngine(() => queue.shift()!.promise);
  const loadEngine = () => engine;
  const { result } = renderHook(() => useSearchQuery({ documents, loadEngine, open: true }));

  act(() => result.current.search('a'));
  await advance(150);
  act(() => result.current.search('ab'));
  await advance(150);

  await act(async () => {
    second.resolve([hit('Newer')]);
    first.resolve([hit('Stale')]);
    await first.promise;
  });

  expect(result.current.hits).toEqual([hit('Newer')]);
});

it('does not commit a stale in-flight search that resolves mid-burst', async () => {
  const slowA = deferred<SearchHit[]>();
  const slowB = deferred<SearchHit[]>();
  const queue = [slowA, slowB];
  const engine = createEngine(() => queue.shift()!.promise);
  const loadEngine = () => engine;
  const { result } = renderHook(() => useSearchQuery({ documents, loadEngine, open: true }));

  act(() => result.current.search('a'));
  await advance(150);
  act(() => result.current.search('ab'));

  await act(async () => {
    slowA.resolve([hit('Stale')]);
    await slowA.promise;
  });

  expect(result.current.hits).toEqual([]);
  expect(result.current.loading).toBe(true);

  await advance(150);
  await act(async () => {
    slowB.resolve([hit('Fresh')]);
    await slowB.promise;
  });

  expect(result.current.hits).toEqual([hit('Fresh')]);
  expect(result.current.loading).toBe(false);
});

it('cancels a pending search and clears results on an empty query', async () => {
  const engine = createEngine(async () => [hit('Button')]);
  const loadEngine = () => engine;
  const { result } = renderHook(() => useSearchQuery({ documents, loadEngine, open: true }));

  act(() => result.current.search('b'));
  await advance(50);
  act(() => result.current.search('   '));

  await advance(150);

  expect(engine.search).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
  expect(result.current.hits).toEqual([]);
});
