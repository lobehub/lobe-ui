import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin/vite';
import { defineConfig } from 'vitest/config';

import { stylexOptions } from './config/stylex';
import { name } from './package.json';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [stylex({ ...stylexOptions, runtimeInjection: true })],
  resolve: {
    alias: [
      { find: '@', replacement: srcPath },
      { find: `${name}/form`, replacement: `${srcPath}/FormKit` },
      { find: `${name}/pro-table`, replacement: `${srcPath}/ProTable` },
      // Published @lobehub/icons still imports the removed `base-ui` subpath.
      { find: `${name}/base-ui`, replacement: srcPath },
      { find: name, replacement: srcPath },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    hookTimeout: 30_000,
    server: {
      deps: {
        // Apply source aliases to @lobehub/ui imports inside the ESM icons package;
        // material-color-utilities ships extensionless ESM imports Node can't resolve;
        // docs-kit ships TypeScript source.
        inline: ['@lobehub/docs-kit', '@lobehub/icons', '@material/material-color-utilities'],
      },
    },
    // Production Vite compiler integration can exceed one minute when the
    // complete suite runs with coverage on constrained CI runners.
    testTimeout: 120_000,
  },
});
