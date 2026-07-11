import type { DocumentManifestEntry } from '../types/content';
import { createManifestEngine } from './manifestEngine';
import { createPagefindEngine, type PagefindLoader, type PagefindModule } from './pagefindEngine';
import { PAGEFIND_HMR_EVENT, type SearchEngine } from './types';

export { PAGEFIND_HMR_EVENT } from './types';
const PAGEFIND_MODULE_PATH = '/pagefind/pagefind.js';
let browserPagefindGeneration = 0;

type ImportPagefindModule = (specifier: string) => Promise<PagefindModule>;

export interface ResilientSearchEngine extends SearchEngine {
  reset: () => Promise<void>;
  updateDocuments: (documents: readonly DocumentManifestEntry[]) => void;
}

interface ResilientSearchEngineOptions {
  documents: readonly DocumentManifestEntry[];
  loadPagefind: PagefindLoader;
}

export const createBrowserPagefindLoader =
  (
    importModule: ImportPagefindModule = (specifier) =>
      import(/* @vite-ignore */ specifier) as Promise<PagefindModule>,
  ): PagefindLoader =>
  () =>
    importModule(
      browserPagefindGeneration === 0
        ? PAGEFIND_MODULE_PATH
        : `${PAGEFIND_MODULE_PATH}?hmr=${browserPagefindGeneration}`,
    );

const loadBrowserPagefind = createBrowserPagefindLoader();

export function createResilientSearchEngine({
  documents,
  loadPagefind,
}: ResilientSearchEngineOptions): ResilientSearchEngine {
  let fallback = createManifestEngine(documents);
  let primary = createPagefindEngine(loadPagefind);
  let failed = false;
  let generation = 0;
  let resetting: Promise<void> | undefined;

  const failover = async <T>(
    primaryOperation: (engine: SearchEngine) => Promise<T>,
    fallbackOperation: (engine: SearchEngine) => Promise<T>,
  ): Promise<T> => {
    const resetBarrier = resetting;
    if (resetBarrier) {
      try {
        await resetBarrier;
      } catch {
        // Reset installs the fresh primary before retiring the old one.
      }
    }
    if (failed) return fallbackOperation(fallback);
    const activePrimary = primary;
    const activeGeneration = generation;
    try {
      return await primaryOperation(activePrimary);
    } catch {
      if (activePrimary === primary && activeGeneration === generation) failed = true;
      return fallbackOperation(fallback);
    }
  };

  return {
    async dispose() {
      generation += 1;
      failed = false;
      const resetBarrier = resetting;
      if (resetBarrier) {
        try {
          await resetBarrier;
        } catch {
          // Continue disposing the fresh primary after a retired cleanup failure.
        }
      }
      await primary.dispose?.();
      await fallback.dispose?.();
    },
    async init() {
      await failover(
        (engine) => engine.init(),
        (engine) => engine.init(),
      );
    },
    async preload(query) {
      await failover(
        (engine) => engine.preload(query),
        (engine) => engine.preload(query),
      );
    },
    async reset() {
      if (resetting) return resetting;
      generation += 1;
      const previous = primary;
      primary = createPagefindEngine(loadPagefind);
      failed = false;
      const pendingReset = previous.dispose?.() ?? Promise.resolve();
      resetting = pendingReset;
      try {
        await pendingReset;
      } finally {
        if (resetting === pendingReset) resetting = undefined;
      }
    },
    async search(query) {
      return failover(
        (engine) => engine.search(query),
        (engine) => engine.search(query),
      );
    },
    updateDocuments(nextDocuments) {
      fallback = createManifestEngine(nextDocuments);
    },
  };
}

let singleton: ResilientSearchEngine | undefined;

export function loadSearchEngine(
  documents: readonly DocumentManifestEntry[],
  loadPagefind: PagefindLoader = loadBrowserPagefind,
): ResilientSearchEngine {
  if (singleton) singleton.updateDocuments(documents);
  else singleton = createResilientSearchEngine({ documents, loadPagefind });
  return singleton;
}

export async function resetSearchEngine(): Promise<void> {
  browserPagefindGeneration += 1;
  await singleton?.reset();
}

export async function disposeSearchEngine(): Promise<void> {
  const previous = singleton;
  singleton = undefined;
  await previous?.dispose?.();
}

export function handlePagefindHmr(
  onError: (error: unknown) => void = (error) =>
    console.error('Unable to reset the Pagefind search engine after HMR:', error),
): void {
  void resetSearchEngine().catch(onError);
}

if (import.meta.hot) {
  import.meta.hot.on(PAGEFIND_HMR_EVENT, () => {
    handlePagefindHmr();
  });
}
