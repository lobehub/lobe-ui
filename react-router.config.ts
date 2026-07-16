import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './packages/docs-kit/site/compiler/manifests';

export default {
  appDirectory: 'packages/docs-kit/site',
  buildDirectory: '.react-router/build',
  prerender: async () => getPrerenderPaths(),
  routeDiscovery: { mode: 'initial' },
  ssr: false,
} satisfies Config;
