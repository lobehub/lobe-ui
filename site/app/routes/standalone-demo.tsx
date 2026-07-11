import { use, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { MetaFunction } from 'react-router';
import { isRouteErrorResponse, useParams, useRouteError } from 'react-router';

import { readLegacyMap, type StandaloneDemoMapEntry } from '../../compiler/demo/readLegacyMap';
import type { DocumentationInventory } from '../../compiler/types';
import StandaloneDemoPage from '../../components/Demo/StandaloneDemoPage';
import compatibility from '../../content/compatibility.json';
import type { DemoAppearance, DemoModule } from '../../types/demo';
import { createDescriptorPromiseCache } from '../demos/descriptorPromiseCache';

export interface ResolvedStandaloneDemo extends StandaloneDemoMapEntry {
  requestedRouteId?: string;
}

const standaloneEntries = readLegacyMap(compatibility as DocumentationInventory);
const standaloneEntriesById = new Map(standaloneEntries.map((entry) => [entry.id, entry]));
const standaloneSources = new Set(standaloneEntries.map(({ sourcePath }) => sourcePath));
const standaloneDescriptorCache = createDescriptorPromiseCache<DemoModule>();

if (import.meta.hot) {
  import.meta.hot.dispose(() => standaloneDescriptorCache.clear());
  import.meta.hot.accept(() => standaloneDescriptorCache.clear());
}

export const loadStandaloneDescriptor = (sourcePath: string): Promise<DemoModule> =>
  standaloneDescriptorCache.load(sourcePath, () =>
    import('../demos/standaloneDemoLoaders').then((loaders) => {
      loaders.assertStandaloneLoaderCoverage(standaloneSources);
      return loaders.loadStandaloneDemoDescriptor(sourcePath);
    }),
  );

export function resolveStandaloneDemo(
  demoId: string,
  requestedRouteId?: null | string,
): ResolvedStandaloneDemo | undefined {
  const entry = standaloneEntriesById.get(demoId);
  if (!entry) return;
  return {
    ...entry,
    requestedRouteId: requestedRouteId || undefined,
  };
}

export function getStandaloneDemoOrThrow(
  demoId: string,
  requestedRouteId?: null | string,
): ResolvedStandaloneDemo {
  const entry = resolveStandaloneDemo(demoId, requestedRouteId);
  if (entry) return entry;

  throw new Response('Standalone demo not found', {
    status: 404,
    statusText: 'Not Found',
  });
}

export const meta: MetaFunction = ({ location, params }) => {
  const requestedRouteId = new URLSearchParams(location.search).get('routeId');
  const entry = resolveStandaloneDemo(params.demoId ?? '', requestedRouteId);
  const title = entry ? `${entry.id} demo - Lobe UI` : 'Demo not found - Lobe UI';
  return [{ title }, { content: 'noindex, nofollow', name: 'robots' }];
};

const getAppearance = (value: null | string): DemoAppearance =>
  value === 'dark' ? 'dark' : 'light';

interface StandaloneQueryState {
  appearance: DemoAppearance;
  requestedRouteId?: string;
}

interface StandaloneQuerySyncProps {
  demo: DemoModule;
  initialSearch: string;
  metadataRouteId?: string;
}

const parseStandaloneQuery = (search: string): StandaloneQueryState => {
  const searchParams = new URLSearchParams(search);
  return {
    appearance: getAppearance(searchParams.get('appearance')),
    requestedRouteId: searchParams.get('routeId') || undefined,
  };
};

const subscribeToLocation = (onStoreChange: () => void): (() => void) => {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
};

const getLocationSearch = (): string => window.location.search;

export function StandaloneQuerySync({
  demo,
  initialSearch,
  metadataRouteId,
}: StandaloneQuerySyncProps) {
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, () => initialSearch);
  const query = useMemo(() => parseStandaloneQuery(search), [search]);

  useEffect(() => {
    document.documentElement.dataset.standaloneAppearance = query.appearance;
  }, [query.appearance]);

  return (
    <StandaloneDemoPage
      appearance={query.appearance}
      demo={demo}
      metadataRouteId={metadataRouteId}
      requestedRouteId={query.requestedRouteId}
    />
  );
}

export default function StandaloneDemoRoute() {
  const { demoId = '' } = useParams();
  const entry = getStandaloneDemoOrThrow(demoId);
  const demo = use(loadStandaloneDescriptor(entry.sourcePath));

  return <StandaloneQuerySync demo={demo} initialSearch="" metadataRouteId={entry.routeId} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="standalone-demo-page standalone-demo-page--error" data-standalone-demo="">
      <h1>{notFound ? 'Demo not found' : 'Demo unavailable'}</h1>
      <p>
        {notFound
          ? 'The requested standalone demo identifier is not registered.'
          : 'The standalone demo could not be rendered.'}
      </p>
    </main>
  );
}
