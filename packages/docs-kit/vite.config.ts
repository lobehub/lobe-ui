import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

const stylex = async () => {
  if (!docsConfig.stylex) return;
  const plugin = repositoryRequire(
    '@stylexjs/unplugin/vite',
  ) as typeof import('@stylexjs/unplugin/vite');
  // docs.config is serialized out of a subprocess, so options holding functions (lightningcss
  // visitors) are passed as a module path and loaded here instead.
  const options =
    typeof docsConfig.stylex === 'string'
      ? (await import(pathToFileURL(path.resolve(repositoryRoot, docsConfig.stylex)).href)).default
      : docsConfig.stylex;
  // Without a target the plugin appends to the first CSS asset it finds (e.g. Tag-*.css), which
  // only the routes importing that component link; root-*.css is linked on every page.
  const stylexPlugin = plugin.default({
    cssInjectionTarget: (fileName: string) => /(^|\/)root-[\w-]+\.css$/.test(fileName),
    ...options,
  });
  const { generateBundle, writeBundle } = stylexPlugin as Record<string, any>;
  // The SSR build has no root CSS asset, so the plugin would append a second copy to a route's CSS
  // that React Router moves into the client assets and links from that route.
  const clientOnly = (hook: any) =>
    function (this: any, ...args: unknown[]) {
      if (this.environment?.config.consumer === 'server') return;
      return hook.apply(this, args);
    };
  return {
    ...stylexPlugin,
    generateBundle: clientOnly(generateBundle),
    writeBundle: clientOnly(writeBundle),
  };
};

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
        // A pre-bundled dep that imports an aliased package (@lobehub/icons ->
        // @lobehub/ui -> src) would otherwise inline its own copy of that source,
        // skipping source plugins such as StyleX. Externalized, the import is
        // resolved through the alias at serve time.
        exclude: Object.keys(docsConfig.alias ?? {}),
        // Installed UI packages and generated demo modules expose these only at
        // runtime. Pre-bundle the dependencies available in the consuming project
        // to avoid an invalidating second optimization pass after first paint.
        include: runtimeOptimizeDeps,
      },
  plugins: [
    stylex(),
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
    dedupe: ['@lobehub/ui', 'react', 'react-dom'],
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [/^@lobehub\/ui(?:\/.*)?$/, '@lobehub/icons', '@lobehub/fluent-emoji'],
  },
});
