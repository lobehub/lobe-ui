import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './compiler/manifests';

export const lobeDocsReactRouterConfig = {
  appDirectory: import.meta.dirname,
  buildDirectory: '.react-router/build',
  prerender: async () => getPrerenderPaths(),
  routeDiscovery: { mode: 'initial' },
  ssr: false,
} satisfies Config;

export const defineLobeDocsReactRouterConfig = (overrides: Config = {}): Config => ({
  ...lobeDocsReactRouterConfig,
  ...overrides,
});

export default lobeDocsReactRouterConfig;
