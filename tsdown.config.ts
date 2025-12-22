import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
];

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    'src/awesome/index.ts',
    'src/brand/index.ts',
    'src/chat/index.ts',
    'src/color/index.ts',
    'src/icons/index.ts',
    'src/mdx/index.ts',
    'src/mobile/index.ts',
    'src/storybook/index.ts',
  ],
  external,
  format: ['esm'],
  outDir: 'es',
  sourcemap: true,
  unbundle: true,
});
