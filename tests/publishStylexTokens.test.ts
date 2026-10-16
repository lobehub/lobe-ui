// @vitest-environment node
import { mkdtempSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { publishStylexTokens } from '../scripts/publishStylexTokens';

type TransformResult = {
  metadata?: { stylex?: unknown[] };
};

type Babel = {
  transformSync: (code: string, options: Record<string, unknown>) => TransformResult | null;
};

type StylexPlugin = ((api: unknown) => unknown) & {
  processStylexRules?: (rules: unknown[], config?: { useLayers?: boolean }) => string;
};

const loadCompiler = () => {
  const rootRequire = createRequire(path.resolve(import.meta.dirname, '../package.json'));
  const unpluginEntry = realpathSync(rootRequire.resolve('@stylexjs/unplugin'));
  const unpluginRoot = path.resolve(path.dirname(unpluginEntry), '..');
  const req = createRequire(path.join(unpluginRoot, 'package.json'));
  const loaded = req('@stylexjs/babel-plugin') as StylexPlugin & { default?: StylexPlugin };
  const plugin = loaded.default ?? loaded;

  return {
    babel: req('@babel/core') as Babel,
    plugin,
    processStylexRules: plugin.processStylexRules ?? loaded.processStylexRules,
  };
};

const consumerSource = `
import * as stylex from '@stylexjs/stylex';
import { cssVar } from '@lobehub/ui/stylex/cssVar.stylex';
import { media } from '@lobehub/ui/stylex/media.stylex';

export const styles = stylex.create({
  title: {
    color: cssVar.colorText,
    fontSize: { default: 16, [media.sm]: 14 },
  },
});
`;

const compileConsumer = (root: string, pkgDir: string) => {
  const { babel, plugin, processStylexRules } = loadCompiler();
  if (!processStylexRules) throw new Error('stylex babel plugin is missing processStylexRules');

  const appFile = path.join(root, 'app.js');
  writeFileSync(appFile, consumerSource);

  const options = {
    dev: false,
    runtimeInjection: false,
    test: false,
    unstable_moduleResolution: { rootDir: root, type: 'commonJS' },
  };
  const transform = (filename: string) => {
    const result = babel.transformSync(readFileSync(filename, 'utf8'), {
      babelrc: false,
      configFile: false,
      filename,
      plugins: [[plugin, options]],
      sourceType: 'module',
    });
    return result?.metadata?.stylex ?? [];
  };

  const rules = [
    ...transform(appFile),
    ...transform(path.join(pkgDir, 'cssVar.stylex.js')),
    ...transform(path.join(pkgDir, 'media.stylex.js')),
  ];

  return processStylexRules(rules, { useLayers: false });
};

describe('published StyleX tokens', () => {
  it('keeps defineConsts source on the public export', () => {
    const pkg = JSON.parse(
      readFileSync(path.resolve(import.meta.dirname, '../package.json'), 'utf8'),
    ) as { exports: Record<string, { default: string; import: string; types: string }> };

    expect(pkg.exports['./stylex/cssVar.stylex']).toEqual({
      default: './es/stylex/cssVar.stylex.js',
      import: './es/stylex/cssVar.stylex.js',
      types: './es/stylex/cssVar.stylex.ts',
    });
    expect(pkg.exports['./stylex/media.stylex']).toEqual({
      default: './es/stylex/media.stylex.js',
      import: './es/stylex/media.stylex.js',
      types: './es/stylex/media.stylex.ts',
    });
  });

  it('inlines token values when a consumer compiles the published modules', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'lobe-stylex-'));
    const pkgDir = path.join(root, 'node_modules', '@lobehub', 'ui');
    publishStylexTokens(pkgDir);
    writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({
        exports: {
          './stylex/cssVar.stylex': {
            default: './cssVar.stylex.js',
            import: './cssVar.stylex.js',
            types: './cssVar.stylex.ts',
          },
          './stylex/media.stylex': {
            default: './media.stylex.js',
            import: './media.stylex.js',
            types: './media.stylex.ts',
          },
        },
        name: '@lobehub/ui',
        type: 'module',
      }),
    );

    const published = readFileSync(path.join(pkgDir, 'cssVar.stylex.js'), 'utf8');
    expect(published).toContain('export const cssVar = stylex.defineConsts(');
    expect(published).not.toContain('export { cssVar }');

    const css = compileConsumer(root, pkgDir);
    expect(css).toContain('color:var(--lobe-color-text)');
    expect(css).toContain('@media (max-width: 575.98px)');
    expect(css.match(/var\(--(?!lobe-)[^)]+\)/g)).toBeNull();
  });
});
