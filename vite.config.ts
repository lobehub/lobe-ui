import path from 'node:path';

import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

import { remarkApi } from './site/compiler/api/remarkApi';
import { rehypeHeadingIds } from './site/compiler/content/rehypeHeadingIds';
import { devPagefindPlugin } from './site/compiler/search/devPagefindPlugin';
import { lobeDocs } from './site/compiler/vitePlugin';

const sourceRoot = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  optimizeDeps: {
    // Components and demos are lazy-loaded per docs page, so with default entry
    // crawling Vite keeps discovering deps mid-session, re-optimizing and
    // full-reloading on nearly every navigation. Crawl all client sources
    // upfront so every dep is found in the initial optimize pass.
    entries: [
      'src/**/*.{ts,tsx}',
      'site/app/**/*.{ts,tsx}',
      'site/components/**/*.{ts,tsx}',
      '!**/*.test.*',
    ],
    // Reached only through a transitive runtime import inside node_modules,
    // which entry crawling cannot see.
    include: ['es-toolkit'],
  },
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    lobeDocs(),
    devPagefindPlugin(),
    mdx({
      include: /\.(md|mdx)$/,
      providerImportSource: '/site/app/mdx-components',
      rehypePlugins: [rehypeHeadingIds],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkApi],
    }),
    reactRouter(),
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
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ['@lobehub/icons', '@lobehub/fluent-emoji'],
  },
});
