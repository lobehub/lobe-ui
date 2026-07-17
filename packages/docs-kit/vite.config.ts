import { createRequire } from 'node:module';
import path from 'node:path';

import { reactRouter } from '@react-router/dev/vite';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Alias, defineConfig, normalizePath } from 'vite';

import { createMdxPlugin } from './site/compiler/content/mdxPlugin';
import { devPagefindPlugin } from './site/compiler/search/devPagefindPlugin';
import { lobeDocs } from './site/compiler/vitePlugin';
import { getDocsConfig } from './src/config';

const repositoryRoot = process.cwd();
const docsKitRoot = normalizePath(import.meta.dirname);
const docsConfig = getDocsConfig(repositoryRoot);
const repositoryRequire = createRequire(path.join(repositoryRoot, 'package.json'));

const runtimeOptimizeDeps = [
  'ahooks',
  'es-toolkit',
  'polished',
  'react-merge-refs',
  'remark-breaks',
  'remark-parse',
  'remark-rehype',
  ...(docsConfig.alias?.['@lobehub/ui/es'] ? ['emoji-regex'] : []),
].filter((dependency) => {
  try {
    repositoryRequire.resolve(dependency);
    return true;
  } catch {
    return false;
  }
});

const escapeRegExp = (value: string): string => value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createAliasEntries = (alias: Record<string, string> = {}): Alias[] =>
  Object.entries(alias)
    .toSorted(([left], [right]) => right.length - left.length)
    .flatMap(([find, target]) => {
      const replacement = path.resolve(repositoryRoot, target);
      const escapedFind = escapeRegExp(find);
      return [
        { find: new RegExp(`^${escapedFind}$`), replacement },
        { find: new RegExp(`^${escapedFind}/(.+)$`), replacement: `${replacement}/$1` },
      ];
    });

export default defineConfig({
  optimizeDeps: process.env.VITEST
    ? { noDiscovery: true }
    : {
        // Components and demos are lazy-loaded per docs page, so with default entry
        // crawling Vite keeps discovering deps mid-session, re-optimizing and
        // full-reloading on nearly every navigation. Crawl all client sources
        // upfront so every dep is found in the initial optimize pass.
        entries: [
          'src/**/*.{ts,tsx}',
          `${docsKitRoot}/site/app/**/*.{ts,tsx}`,
          `${docsKitRoot}/site/components/**/*.{ts,tsx}`,
          '!**/*.d.ts',
          '!**/*.test.*',
        ],
        // Installed UI packages and generated demo modules expose these only at
        // runtime. Pre-bundle the dependencies available in the consuming project
        // to avoid an invalidating second optimization pass after first paint.
        include: runtimeOptimizeDeps,
      },
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    lobeDocs(),
    devPagefindPlugin(),
    createMdxPlugin(),
    // Vite compiler tests run in parallel and share the repository-level
    // React Router typegen directory. The route plugin is covered by the real
    // lobedocs build/typegen commands instead of starting competing watchers.
    process.env.VITEST ? undefined : reactRouter(),
    process.env.ANALYZE
      ? visualizer({ filename: '.react-router/build/client/stats.html' })
      : undefined,
  ],
  resolve: {
    alias: createAliasEntries(docsConfig.alias),
    dedupe: ['@lobehub/ui', 'antd', 'antd-style', 'react', 'react-dom'],
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [/^@lobehub\/ui(?:\/.*)?$/, '@lobehub/icons', '@lobehub/fluent-emoji'],
  },
});
