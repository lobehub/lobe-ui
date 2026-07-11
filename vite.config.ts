import path from 'node:path';

import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { remarkApi } from './site/compiler/api/remarkApi';
import { rehypeHeadingIds } from './site/compiler/content/rehypeHeadingIds';
import { devPagefindPlugin } from './site/compiler/search/devPagefindPlugin';
import { lobeDocs } from './site/compiler/vitePlugin';

const sourceRoot = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  plugins: [
    lobeDocs(),
    devPagefindPlugin(),
    mdx({
      include: /\.(md|mdx)$/,
      providerImportSource: '/site/app/mdx-components',
      rehypePlugins: [rehypeHeadingIds],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkApi],
    }),
    reactRouter(),
    tsconfigPaths({ projects: ['./tsconfig.json', './tsconfig.site.json'] }),
    process.env.ANALYZE
      ? visualizer({ filename: '.react-router/build/client/stats.html' })
      : undefined,
  ],
  resolve: {
    alias: [
      { find: '@', replacement: sourceRoot },
      { find: /^@lobehub\/ui$/, replacement: sourceRoot },
      { find: /^@lobehub\/ui\/(.+)$/, replacement: `${sourceRoot}/$1` },
    ],
  },
});
