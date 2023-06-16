import { defineConfig } from 'vitest/config';

import { name } from './package.json';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': './src',
      [name]: './src',
    },
  },
});
