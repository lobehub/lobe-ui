import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin/rolldown';
import { defineConfig, type Rolldown } from 'tsdown';

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
    generateBundle() {
      const source = [...files]
        .toSorted()
        .map((file) => {
          const css = readFileSync(file, 'utf8').trim();
          return /^@layer lobe-ui\b/.test(css) ? css : `@layer lobe-ui {\n${css}\n}`;
        })
        .join('\n\n');
      this.emitFile({ fileName: 'style.css', source, type: 'asset' });
    },
    name: 'lobe-ui:component-css',
    resolveId: {
      filter: { id: /\.css$/ },
      handler(source, importer) {
        files.add(resolve(dirname(importer!), source));
        return { external: true, id: source, moduleSideEffects: false };
      },
    },
  };
};

// StyleX leaves its priority-0 group (keyframes, custom properties) unlayered by design. This runs
// in closeBundle because StyleX's writeBundle re-appends its CSS when the file no longer contains it verbatim.
const layerStylexBase = (): Rolldown.Plugin => ({
  closeBundle() {
    const file = resolve(root, 'es/style.css');
    if (!existsSync(file)) return;
    const layered: string[] = [];
    const unlayered: string[] = [];
    let depth = 0;
    let statement = '';
    for (const char of readFileSync(file, 'utf8')) {
      statement += char;
      if (char === '{') depth++;
      if (char === '}') depth--;
      if (depth === 0 && (char === '}' || char === ';')) {
        const trimmed = statement.trim();
        (/^@layer\b/.test(trimmed) ? layered : unlayered).push(trimmed);
        statement = '';
      }
    }
    if (unlayered.length === 0) return;
    layered.push(`@layer lobe-ui.priority1 {\n${unlayered.join('\n')}\n}`);
    writeFileSync(file, `${layered.join('\n\n')}\n`);
  },
  name: 'lobe-ui:layer-stylex-base',
});

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    // packages
    ...packageEntries,
    'src/base-ui/FormKit/index.ts',
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
  plugins: [componentCss(), stylex({ ...stylexOptions, dev: false }), layerStylexBase()],

  sourcemap: true,
  unbundle: true,
});
