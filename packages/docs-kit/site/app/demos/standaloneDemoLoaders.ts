import type { DemoModule } from '../../types/demo';
import { createDescriptorPromiseCache } from './descriptorPromiseCache';

type DemoDescriptorLoader = () => Promise<DemoModule>;

const descriptorLoaders = import.meta.glob<DemoModule>(
  ['/src/**/demos/**/*.{js,jsx,ts,tsx}', '/docs/index.tsx'],
  {
    import: 'default',
    query: '?demo',
  },
) as Record<string, DemoDescriptorLoader>;

const descriptorCache = createDescriptorPromiseCache<DemoModule>();

if (import.meta.hot) {
  import.meta.hot.dispose(() => descriptorCache.clear());
  import.meta.hot.accept(() => descriptorCache.clear());
}

export function assertStandaloneLoaderCoverage(sourcePaths: Iterable<string>): void {
  const missing = [...sourcePaths].filter(
    (sourcePath) => !descriptorLoaders[`/${sourcePath.replaceAll('\\', '/')}`],
  );
  if (missing.length > 0) {
    throw new Error(`Missing standalone demo descriptor loaders:\n- ${missing.join('\n- ')}`);
  }
}

export function loadStandaloneDemoDescriptor(sourcePath: string): Promise<DemoModule> {
  const normalizedSourcePath = sourcePath.replaceAll('\\', '/');
  const loader = descriptorLoaders[`/${normalizedSourcePath}`];
  if (!loader) {
    return Promise.reject(
      new Error(`Missing standalone demo descriptor loader for ${normalizedSourcePath}`),
    );
  }

  return descriptorCache.load(normalizedSourcePath, loader);
}
