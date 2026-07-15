import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './site/compiler/manifests';

export default {
  appDirectory: 'site',
  buildDirectory: '.react-router/build',
  prerender: async () => getPrerenderPaths(),
  routeDiscovery: { mode: 'initial' },
  ssr: false,
} satisfies Config;
