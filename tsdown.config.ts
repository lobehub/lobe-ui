import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsdown';

const root = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  // type-only import in static-css/vite; not a dependency, so external it explicitly
  'vite',
];

// 动态查找所有 src/*/index.ts 文件
const srcDir = resolve(root, 'src');
const packageEntries = readdirSync(srcDir)
  .filter((dir) => {
    const dirPath = join(srcDir, dir);
    return statSync(dirPath).isDirectory() && existsSync(join(dirPath, 'index.ts'));
  })
  .map((dir) => `src/${dir}/index.ts`)
  .sort();

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    // packages
    ...packageEntries,
    'src/base-ui/FormKit/index.ts',
    'src/i18n/resources/index.ts',
    'src/static-css/emit/index.ts',
    'src/static-css/runtime/index.ts',
    'src/static-css/vite/index.ts',
  ],
  deps: {
    neverBundle: external,
    resolveDepSubpath: true,
  },
  fixedExtension: true,
  format: ['esm'],

  outDir: 'es',
  // platform 'node' leaks `import "node:module"` into the shared runtime chunk: https://github.com/rolldown/rolldown/issues/11182
  platform: 'neutral',

  sourcemap: true,
  unbundle: true,
});
