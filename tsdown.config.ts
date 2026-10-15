import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin/rolldown';
import { defineConfig, type Rolldown } from 'tsdown';

import { layerComponentCss } from './config/componentCss.ts';
import { stylexOptions } from './config/stylex.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

// 动态查找所有 src/*/index.ts 文件
const srcDir = resolve(root, 'src');
const packageEntries = readdirSync(srcDir)
  .filter((dir) => {
    const dirPath = join(srcDir, dir);
    return statSync(dirPath).isDirectory() && existsSync(join(dirPath, 'index.ts'));
  })
  .map((dir) => `src/${dir}/index.ts`)
  .sort();

const componentCss = (): Rolldown.Plugin => {
  const files = new Set<string>();
  return {
    buildStart() {
      files.clear();
    },
    generateBundle() {
      const source = [...files]
        .toSorted()
        .map((file) => layerComponentCss(readFileSync(file, 'utf8'), file))
        .join('\n\n');
      this.emitFile({
        fileName: 'style.css',
        source: `@layer lobe-base, lobe-popup, lobe-ui;\n\n${source}`,
        type: 'asset',
      });
    },
    name: 'lobe-ui:component-css',
    resolveId: {
      filter: { id: /\.css$/ },
      async handler(source, importer) {
        const resolved = await this.resolve(source, importer, { skipSelf: true });
        if (!resolved) this.error(`Cannot resolve ${source} from ${importer}`);
        files.add(resolved.id);
        return { external: true, id: source, moduleSideEffects: false };
      },
    },
  };
};

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    // packages
    ...packageEntries,
    'src/FormKit/index.ts',
    'src/i18n/resources/index.ts',
  ],
  deps: {
    neverBundle: external,
    resolveDepSubpath: true,
  },
  format: ['esm'],

  outDir: 'es',
  outputOptions: { assetFileNames: '[name][extname]' },
  // componentCss must emit style.css before StyleX's generateBundle appends to the first CSS asset;
  // StyleX re-emits that asset by name, so an unhashed assetFileNames keeps it at es/style.css.
  plugins: [componentCss(), stylex({ ...stylexOptions, dev: false })],

  sourcemap: true,
  unbundle: true,
});
