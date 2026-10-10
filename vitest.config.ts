import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin/vite';
import { defineConfig } from 'vitest/config';

import { stylexOptions } from './config/stylex';
import { name } from './package.json';
import { lobeDocsSiteConfigPlugin } from './packages/docs-kit/site/compiler/vitePlugin';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [stylex({ ...stylexOptions, runtimeInjection: true }), lobeDocsSiteConfigPlugin()],
  resolve: {
    alias: [
      { find: '@', replacement: srcPath },
      { find: name, replacement: srcPath },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    hookTimeout: 30_000,
    // Production Vite compiler integration can exceed one minute when the
    // complete suite runs with coverage on constrained CI runners.
    testTimeout: 120_000,
  },
});
