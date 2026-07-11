import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { lobeDocs } from './site/compiler/vitePlugin';

export default defineConfig({
  plugins: [
    lobeDocs(),
    mdx(),
    reactRouter(),
    tsconfigPaths(),
    process.env.ANALYZE
      ? visualizer({ filename: '.react-router/build/client/stats.html' })
      : undefined,
  ],
});
