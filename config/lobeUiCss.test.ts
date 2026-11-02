// @vitest-environment node
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { Rolldown } from 'tsdown';

import { lobeUiStylex } from './lobeUiCss';
import { LAYER_ROOTS } from './stylexCss';

const fixture = {
  'A/A.ts': `import * as stylex from '@stylexjs/stylex';
import './style.css';
import { B } from '../B/B';
const s = stylex.create({ a: { color: 'red', marginTop: { default: 1, ':hover': 2 } } });
export const A = () => [stylex.props(s.a), B()];`,
  'A/index.ts': `export { A } from './A';`,
  'A/style.css': `.lobe-a { color: blue; }`,
  'B/B.ts': `import * as stylex from '@stylexjs/stylex';
import { media } from '../media.stylex';
const s = stylex.create({ b: { color: 'red', padding: { default: 4, [media.wide]: 8 } } });
export const B = () => stylex.props(s.b);`,
  'C/index.ts': `export { B } from '../B/B';`,
  'D/index.ts': `export const D = 1;`,
  'main.ts': `export * from './C';\nexport * from './D';`,
  'media.stylex.ts': `import * as stylex from '@stylexjs/stylex';
export const media = stylex.defineConsts({ wide: '@media (min-width: 768px)' });`,
};

const build = async () => {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'lobe-ui-css-')));
  const src = path.join(root, 'src');
  for (const [file, code] of Object.entries(fixture)) {
    mkdirSync(path.dirname(path.join(src, file)), { recursive: true });
    writeFileSync(path.join(src, file), code);
  }
  const { css, transform } = lobeUiStylex({
    components: [
      { entry: path.join(src, 'A/index.ts'), fileName: 'css/A.css' },
      { entry: path.join(src, 'B/B.ts'), fileName: 'css/B.css' },
      { entry: path.join(src, 'C/index.ts'), fileName: 'css/C.css' },
      { entry: path.join(src, 'D/index.ts'), fileName: 'css/D.css' },
    ],
    stylex: {
      classNamePrefix: 'lb',
      dev: false,
      unstable_moduleResolution: { rootDir: root, type: 'commonJS' },
      useCSSLayers: { prefix: 'lobe-ui' },
    },
  });
  const bundle = await Rolldown.rolldown({
    external: ['@stylexjs/stylex'],
    input: [path.join(src, 'A/index.ts'), path.join(src, 'B/B.ts'), path.join(src, 'main.ts')],
    plugins: [css, transform],
  });
  const { output } = await bundle.generate({
    assetFileNames: '[name][extname]',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: src,
  });
  const files = new Map(
    output.map((item) => [item.fileName, item.type === 'chunk' ? item.code : String(item.source)]),
  );
  const get = (name: string) => {
    const file = files.get(name);
    if (file === undefined) throw new Error(`${name} not in [${[...files.keys()].join(', ')}]`);
    return file;
  };
  return { files, get };
};

const classOf = (css: string, declaration: RegExp) => {
  const match = new RegExp(`\\.(lb\\w+)\\s*\\{\\s*${declaration.source}`).exec(css);
  if (!match) throw new Error(`no atom for ${declaration}`);
  return match[1];
};

describe('lobeUiStylex', () => {
  it('leaves the JS free of stylesheet imports and emits no per-module sheets', async () => {
    const { files, get } = await build();

    for (const chunk of ['A/A.js', 'A/index.js', 'B/B.js'])
      expect(get(chunk)).not.toContain('.css');
    expect([...files.keys()].filter((name) => name.endsWith('.css')).toSorted()).toEqual([
      'css/A.css',
      'css/B.css',
      'css/C.css',
      'style.css',
    ]);
  });

  it('declares the same layer order in every stylesheet', async () => {
    const { get } = await build();
    const orderOf = (css: string) => /^@layer lobe-ui\.[^;]+;$/m.exec(css)?.[0];

    expect(orderOf(get('css/A.css'))).toBeDefined();
    expect(orderOf(get('css/A.css'))).toBe(orderOf(get('css/B.css')));
    expect(orderOf(get('css/B.css'))).toBe(orderOf(get('style.css')));
  });

  it('resolves a defineConsts media query whose module is tree-shaken away', async () => {
    const { get } = await build();

    expect(get('css/B.css')).toMatch(/@media \(width >= 768px\)/);
    expect(get('css/B.css')).not.toContain('var(--');
  });

  it('writes one style.css with the hand-written sheets and each atom once', async () => {
    const { get } = await build();
    const all = get('style.css');
    const red = classOf(all, /color:\s*red/);

    expect(all.startsWith(LAYER_ROOTS)).toBe(true);
    expect(all.indexOf(LAYER_ROOTS, 1)).toBe(-1);
    expect(all).toMatch(/@layer lobe-ui \{\s*\.lobe-a/);
    expect(all).toMatch(/padding/);
    expect(all.split(`.${red}`).length - 1).toBe(1);
  });

  it('writes one stylesheet per component with everything its imports reach', async () => {
    const { get } = await build();
    const a = get('css/A.css');
    const b = get('css/B.css');
    const red = classOf(a, /color:\s*red/);

    expect(a.startsWith(LAYER_ROOTS)).toBe(true);
    expect(a).toContain('.lobe-a');
    expect(a).toMatch(/margin-top/);
    expect(a).toMatch(/padding/);
    expect(a.split(`.${red}`).length - 1).toBe(1);
    expect(b).toMatch(/padding/);
    expect(b).not.toMatch(/margin-top/);
    expect(b).not.toContain('.lobe-a');
  });

  it('writes no stylesheet for a component without styles', async () => {
    const { files } = await build();

    expect(files.has('css/D.css')).toBe(false);
  });

  it('follows a re-export-only index that gets no chunk of its own', async () => {
    const { get } = await build();

    expect(get('css/C.css')).toMatch(/padding/);
    expect(get('css/C.css')).not.toMatch(/margin-top/);
  });
});
