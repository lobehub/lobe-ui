import type { SearchEngine, SearchHit } from './types';

const RESULT_LIMIT = 10;
const PAGEFIND_BASE_URL = 'https://ui.lobehub.com';

export interface PagefindSubResult {
  plain_excerpt?: string;
  title?: string;
  url?: string;
}

export interface PagefindFragment {
  meta?: Record<string, unknown>;
  plain_excerpt?: string;
  sub_results?: PagefindSubResult[];
  url?: string;
}

export interface PagefindResult {
  data: () => Promise<PagefindFragment>;
}

export interface PagefindModule {
  destroy?: () => Promise<void> | void;
  init: () => Promise<void> | void;
  preload: (query: string) => Promise<void> | void;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

export type PagefindLoader = () => Promise<PagefindModule>;

const toPathname = (url: string): string => {
  try {
    const parsed = new URL(url, PAGEFIND_BASE_URL);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
};

const stringMeta = (fragment: PagefindFragment, key: string): string => {
  const value = fragment.meta?.[key];
  return typeof value === 'string' ? value : '';
};

const toSearchHit = (fragment: PagefindFragment): SearchHit | undefined => {
  const pageUrl = fragment.url;
  if (!pageUrl) return;

  const subResult = fragment.sub_results?.find((result) => Boolean(result.url));
  const pathname = toPathname(subResult?.url ?? pageUrl);
  const title = stringMeta(fragment, 'title') || subResult?.title || pathname;

  return {
    excerpt: subResult?.plain_excerpt ?? fragment.plain_excerpt ?? '',
    id: pathname,
    pathname,
    section: subResult?.title || undefined,
    title,
  };
};

export function createPagefindEngine(loadPagefind: PagefindLoader): SearchEngine {
  let searchGeneration = 0;
  let lifecycleGeneration = 0;
  let module: PagefindModule | undefined;
  let initialization:
    { generation: number; promise: Promise<PagefindModule | undefined> } | undefined;
  let disposal: Promise<void> | undefined;
  const operations = new Set<Promise<unknown>>();

  const ensureModule = (generation: number): Promise<PagefindModule | undefined> => {
    if (generation !== lifecycleGeneration) return Promise.resolve(undefined);
    if (module) return Promise.resolve(module);
    if (initialization?.generation === generation) return initialization.promise;

    const promise = (async () => {
      const candidate = await loadPagefind();
      if (generation !== lifecycleGeneration) {
        await candidate.destroy?.();
        return;
      }
      try {
        await candidate.init();
      } catch (initializationError) {
        try {
          await candidate.destroy?.();
        } catch (cleanupError) {
          throw new AggregateError(
            [initializationError, cleanupError],
            'Pagefind initialization and cleanup failed',
          );
        }
        throw initializationError;
      }
      if (generation !== lifecycleGeneration) {
        await candidate.destroy?.();
        return;
      }
      module = candidate;
      return candidate;
    })();
    initialization = { generation, promise };
    return promise;
  };

  const track = <T>(operation: Promise<T>): Promise<T> => {
    operations.add(operation);
    void operation
      .finally(() => operations.delete(operation))
      .catch(() => {
        // The original operation remains responsible for exposing its rejection.
      });
    return operation;
  };

  const init = (): Promise<void> =>
    (() => {
      const generation = lifecycleGeneration;
      const pendingDisposal = disposal;
      const modulePromise = pendingDisposal
        ? pendingDisposal.then(() => ensureModule(generation))
        : ensureModule(generation);
      return track(modulePromise.then(() => undefined));
    })();

  const dispose = async (): Promise<void> => {
    if (disposal) return disposal;

    searchGeneration += 1;
    lifecycleGeneration += 1;
    const previousModule = module;
    const previousInitialization = initialization?.promise;
    const pendingOperations = [...operations];
    module = undefined;
    initialization = undefined;

    const pendingDisposal = (async () => {
      await Promise.allSettled([
        ...(previousInitialization ? [previousInitialization] : []),
        ...pendingOperations,
      ]);
      await previousModule?.destroy?.();
    })();
    disposal = pendingDisposal;
    try {
      await pendingDisposal;
    } finally {
      if (disposal === pendingDisposal) disposal = undefined;
    }
  };

  return {
    dispose,
    init,
    async preload(query) {
      const generation = lifecycleGeneration;
      const pendingDisposal = disposal;
      const modulePromise = pendingDisposal
        ? pendingDisposal.then(() => ensureModule(generation))
        : ensureModule(generation);
      await track(
        (async () => {
          const activeModule = await modulePromise;
          if (!activeModule || generation !== lifecycleGeneration) return;
          await activeModule.preload(query);
        })(),
      );
    },
    async search(query) {
      const requestGeneration = ++searchGeneration;
      if (!query.trim()) return [];
      const generation = lifecycleGeneration;
      const pendingDisposal = disposal;
      const modulePromise = pendingDisposal
        ? pendingDisposal.then(() => ensureModule(generation))
        : ensureModule(generation);

      return track(
        (async () => {
          const activeModule = await modulePromise;
          if (!activeModule || generation !== lifecycleGeneration) {
            return [];
          }

          const response = await activeModule.search(query);
          if (generation !== lifecycleGeneration || requestGeneration !== searchGeneration) {
            return [];
          }

          const fragments = await Promise.all(
            response.results.slice(0, RESULT_LIMIT).map((result) => result.data()),
          );
          if (generation !== lifecycleGeneration || requestGeneration !== searchGeneration) {
            return [];
          }

          return fragments.flatMap((fragment) => {
            const hit = toSearchHit(fragment);
            return hit ? [hit] : [];
          });
        })(),
      );
    },
  };
}
