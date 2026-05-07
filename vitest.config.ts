import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { name } from './package.json';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': srcPath,
      [name]: srcPath,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
