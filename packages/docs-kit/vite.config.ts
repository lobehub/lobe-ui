import path from 'node:path';

import { reactRouter } from '@react-router/dev/vite';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Alias, defineConfig } from 'vite';

import { createMdxPlugin } from './site/compiler/content/mdxPlugin';
import { devPagefindPlugin } from './site/compiler/search/devPagefindPlugin';
import { lobeDocs } from './site/compiler/vitePlugin';
import { getDocsConfig } from './src/config';

const repositoryRoot = process.cwd();
const docsConfig = getDocsConfig(repositoryRoot);

const escapeRegExp = (value: string): string => value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createAliasEntries = (alias: Record<string, string> = {}): Alias[] =>
  Object.entries(alias).flatMap(([find, target]) => {
    const replacement = path.resolve(repositoryRoot, target);
    const escapedFind = escapeRegExp(find);
    return [
      { find: new RegExp(`^${escapedFind}$`), replacement },
      { find: new RegExp(`^${escapedFind}/(.+)$`), replacement: `${replacement}/$1` },
    ];
  });

export default defineConfig({
  optimizeDeps: {
    // Components and demos are lazy-loaded per docs page, so with default entry
    // crawling Vite keeps discovering deps mid-session, re-optimizing and
    // full-reloading on nearly every navigation. Crawl all client sources
    // upfront so every dep is found in the initial optimize pass.
    entries: [
      'src/**/*.{ts,tsx}',
      'packages/docs-kit/site/app/**/*.{ts,tsx}',
      'packages/docs-kit/site/components/**/*.{ts,tsx}',
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
    createMdxPlugin(),
    reactRouter(),
    process.env.ANALYZE
      ? visualizer({ filename: '.react-router/build/client/stats.html' })
      : undefined,
  ],
  resolve: {
    alias: createAliasEntries(docsConfig.alias),
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ['@lobehub/icons', '@lobehub/fluent-emoji'],
  },
});
