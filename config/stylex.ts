import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

export const stylexOptions = {
  aliases: { '@/*': [`${rootDir}src/*`] },
  classNamePrefix: 'lb',
  unstable_moduleResolution: { rootDir, type: 'commonJS' as const },
  useCSSLayers: { prefix: 'lobe-ui' },
};
