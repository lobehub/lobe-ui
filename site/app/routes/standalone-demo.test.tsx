import { renderToString } from 'react-dom/server';

import StandaloneDemoPage from '../../components/Demo/StandaloneDemoPage';
import type { DemoModule } from '../../types/demo';
import { getStandaloneDemoOrThrow, meta, resolveStandaloneDemo } from './standalone-demo';

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
    data: undefined,
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
