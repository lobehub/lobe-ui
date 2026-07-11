import { use } from 'react';
import type { MetaFunction } from 'react-router';
import { isRouteErrorResponse, useParams, useRouteError, useSearchParams } from 'react-router';

import { readLegacyMap, type StandaloneDemoMapEntry } from '../../compiler/demo/readLegacyMap';
import type { DocumentationInventory } from '../../compiler/types';
import StandaloneDemoPage from '../../components/Demo/StandaloneDemoPage';
import compatibility from '../../content/compatibility.json';
import type { DemoAppearance, DemoModule } from '../../types/demo';

export interface ResolvedStandaloneDemo extends StandaloneDemoMapEntry {
  requestedRouteId?: string;
}

const standaloneEntries = readLegacyMap(compatibility as DocumentationInventory);
const standaloneEntriesById = new Map(standaloneEntries.map((entry) => [entry.id, entry]));
const standaloneSources = new Set(standaloneEntries.map(({ sourcePath }) => sourcePath));
const standaloneDescriptorPromises = new Map<string, Promise<DemoModule>>();

const loadStandaloneDescriptor = (sourcePath: string): Promise<DemoModule> => {
  const cached = standaloneDescriptorPromises.get(sourcePath);
  if (cached) return cached;

  const promise = import('../demos/standaloneDemoLoaders').then((loaders) => {
    loaders.assertStandaloneLoaderCoverage(standaloneSources);
    return loaders.loadStandaloneDemoDescriptor(sourcePath);
  });
  standaloneDescriptorPromises.set(sourcePath, promise);
  return promise;
};

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

export default function StandaloneDemoRoute() {
  const { demoId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const requestedRouteId = searchParams.get('routeId');
  const entry = getStandaloneDemoOrThrow(demoId, requestedRouteId);
  const demo = use(loadStandaloneDescriptor(entry.sourcePath));

  return (
    <StandaloneDemoPage
      appearance={getAppearance(searchParams.get('appearance'))}
      demo={demo}
      metadataRouteId={entry.routeId}
      requestedRouteId={entry.requestedRouteId}
    />
  );
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
