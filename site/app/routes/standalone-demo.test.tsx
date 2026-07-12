import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import StandaloneDemoPage from '../../components/Demo/StandaloneDemoPage';
import type { DemoModule } from '../../types/demo';
import {
  getStandaloneDemoOrThrow,
  loadStandaloneDescriptor,
  meta,
  resolveStandaloneDemo,
  StandaloneQuerySync,
} from './standalone-demo';

const loaderMocks = vi.hoisted(() => ({
  assertCoverage: vi.fn(),
  loadDescriptor: vi.fn(),
}));

vi.mock('../demos/standaloneDemoLoaders', () => ({
  assertStandaloneLoaderCoverage: loaderMocks.assertCoverage,
  loadStandaloneDemoDescriptor: loaderMocks.loadDescriptor,
}));

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      media: '',
      removeEventListener: vi.fn(),
    })),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  history.replaceState(null, '', '/');
  loaderMocks.assertCoverage.mockReset();
  loaderMocks.loadDescriptor.mockReset();
});

it('resolves exclusively by a frozen demo id and treats routeId as metadata', () => {
  expect(resolveStandaloneDemo('src-button-demo-demos', 'wrong/route')).toMatchObject({
    requestedRouteId: 'wrong/route',
    routeId: 'components/Button/index',
    sourcePath: 'src/Button/demos/index.tsx',
  });
});

it('also resolves the deterministic canonical id for a source', () => {
  expect(resolveStandaloneDemo('src-button-demos-index')).toMatchObject({
    sourcePath: 'src/Button/demos/index.tsx',
  });
});

it('uses route-level not-found behavior for an unknown demo id', () => {
  try {
    getStandaloneDemoOrThrow('unknown-demo');
    expect.unreachable('Expected a route response');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect((error as Response).status).toBe(404);
  }
});

it('emits noindex metadata for standalone demos', () => {
  const descriptors = meta({
    loaderData: {},
    location: {
      hash: '',
      key: 'standalone',
      pathname: '/~demos/src-button-demo-demos',
      search: '?routeId=wrong%2Froute',
      state: null,
    },
    matches: [],
    params: { demoId: 'src-button-demo-demos' },
  });

  expect(descriptors).toEqual(
    expect.arrayContaining([{ content: 'noindex, nofollow', name: 'robots' }]),
  );
});

it('renders a canonical standalone preview without recursively creating an iframe', () => {
  const demo: DemoModule = {
    editable: true,
    id: 'standalone-canonical',
    legacyIds: ['standalone-legacy'],
    load: vi.fn(async () => () => null),
    loadScope: vi.fn(async () => ({})),
    routeId: 'components/Standalone/index',
    source: 'export default () => null;',
    sourcePath: 'src/Standalone/demos/index.tsx',
  };

  const html = renderToString(
    <StandaloneDemoPage appearance="dark" demo={demo} metadataRouteId="metadata/only" />,
  );

  expect(html).toContain('data-standalone-demo');
  expect(html).toContain('data-demo-appearance="dark"');
  expect(html).toContain('data-demo-placeholder');
  expect(html).not.toContain('<iframe');
  expect(demo.load).not.toHaveBeenCalled();
});

it('synchronizes the real hard-refresh query after hydration without using routeId for selection', async () => {
  const demo: DemoModule = {
    editable: true,
    id: 'standalone-query-sync',
    legacyIds: [],
    load: async () => () => null,
    loadScope: async () => ({}),
    routeId: 'components/Canonical/index',
    source: 'export default () => null;',
    sourcePath: 'src/Canonical/demos/index.tsx',
  };
  const page = <StandaloneQuerySync demo={demo} initialSearch="" metadataRouteId={demo.routeId} />;
  const host = document.createElement('div');
  host.innerHTML = renderToString(page);
  document.body.append(host);
  expect(host.querySelector('main')?.dataset.demoAppearance).toBe('light');
  expect(host.querySelector('main')?.dataset.requestedRouteId).toBeUndefined();
  history.replaceState(
    null,
    '',
    '/~demos/standalone-query-sync?routeId=wrong%2Froute&appearance=dark',
  );

  const hydrated = render(page, { container: host, hydrate: true });

  const main = screen.getByRole('main');
  await waitFor(() => expect(main.dataset.demoAppearance).toBe('dark'));
  expect(main.dataset.demoRouteId).toBe('components/Canonical/index');
  expect(main.dataset.requestedRouteId).toBe('wrong/route');
  hydrated.unmount();
  host.remove();
});

it('evicts a rejected route-level descriptor promise so a later request can retry', async () => {
  const descriptor = {
    editable: true,
    id: 'retry-descriptor',
    legacyIds: [],
    load: async () => () => null,
    loadScope: async () => ({}),
    routeId: 'components/Retry/index',
    source: 'export default () => null;',
    sourcePath: 'src/Retry/demos/index.tsx',
  } satisfies DemoModule;
  loaderMocks.loadDescriptor
    .mockRejectedValueOnce(new Error('Transient descriptor failure'))
    .mockResolvedValueOnce(descriptor);

  await expect(loadStandaloneDescriptor('src/Retry/demos/index.tsx')).rejects.toThrow(
    'Transient descriptor failure',
  );
  await expect(loadStandaloneDescriptor('src/Retry/demos/index.tsx')).resolves.toBe(descriptor);
  expect(loaderMocks.loadDescriptor).toHaveBeenCalledTimes(2);
});
