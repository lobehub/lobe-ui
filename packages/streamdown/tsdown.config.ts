import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsdown';

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'),
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

export default defineConfig({
  dts: true,
  entry: ['src/index.ts', 'src/profiler/index.ts'],
  fixedExtension: true,
  external: [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    'react/jsx-runtime',
    // Public signatures expose hast/unist nodes. Without these the dts bundler
    // vendors a structural copy into es/node_modules, and a consumer's own
    // hast `Root` stops being assignable to ours.
    'hast',
    'unist',
  ],
  format: 'esm',
  outDir: 'es',
  platform: 'browser',
  unbundle: true,
});
