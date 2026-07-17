import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { name } from './package.json';
import { lobeDocsSiteConfigPlugin } from './packages/docs-kit/site/compiler/vitePlugin';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));
const antdThemePath = fileURLToPath(new URL('./src/styles/theme/antdTheme.ts', import.meta.url));

export default defineConfig({
  plugins: [lobeDocsSiteConfigPlugin()],
  resolve: {
    alias: [
      { find: '@lobehub/ui/es/styles/theme/antdTheme', replacement: antdThemePath },
      { find: '@', replacement: srcPath },
      { find: name, replacement: srcPath },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    hookTimeout: 30_000,
    testTimeout: 20_000,
  },
});
