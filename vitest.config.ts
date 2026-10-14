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
      { find: '@lobehub/ui/base-ui/form', replacement: `${srcPath}/base-ui/FormKit` },
      { find: '@lobehub/ui/base-ui/pro-table', replacement: `${srcPath}/base-ui/ProTable` },
      { find: '@', replacement: srcPath },
      { find: name, replacement: srcPath },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    hookTimeout: 30_000,
    server: {
      deps: {
        // Apply source aliases to @lobehub/ui imports inside the ESM icons package.
        inline: ['@lobehub/icons'],
      },
    },
    // Production Vite compiler integration can exceed one minute when the
    // complete suite runs with coverage on constrained CI runners.
    testTimeout: 120_000,
  },
});
