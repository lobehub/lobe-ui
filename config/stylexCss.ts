import { createRequire } from 'node:module';

import Specificity from '@bramus/specificity';

import { stylexOptions } from './stylex.ts';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const { browserslistToTargets, transform } = unpluginRequire(
  'lightningcss',
) as typeof import('lightningcss');
const browserslist = unpluginRequire('browserslist') as () => string[];
const stylexBabel = unpluginRequire('@stylexjs/babel-plugin');
const { processStylexRules } = (stylexBabel.default ?? stylexBabel) as {
  processStylexRules: (rules: StylexRule[], config: { legacyDisableLayers: boolean }) => string;
};
const targets = browserslistToTargets(browserslist());

export type StylexRule = [
  string,
  { constKey?: string; constVal?: number | string; ltr: string; rtl?: string | null },
  number,
];

export const LAYER_ROOTS = '@layer lobe-base, lobe-popup, lobe-ui;';

export const isConstant = ([, body]: StylexRule) => body.constKey != null && body.constVal != null;

const selectorOf = (ltr: string) => {
  const head = ltr.slice(0, ltr.lastIndexOf('{'));
  return head
    .slice(head.lastIndexOf('{') + 1)
    .replaceAll(/\.([\dA-Za-z]+), \.([\dA-Za-z]+):root/g, '.$1.$1, .$1.$1:root');
};

interface LayerKey {
  name: string;
  sort: number[];
}

// StyleX orders atoms in one sheet by priority level (a layer each), then by specificity, then by
// priority. Split sheets load in any order, so each (level, specificity, priority) gets its own
// sublayer and every sheet declares the same full order.
const layerKeyOf = ([, body, priority]: StylexRule): LayerKey => {
  const level = Math.floor(priority / 1000);
  if (level === 0) return { name: 'lobe-ui.l0', sort: [0, 0, 0, 0, 0] };
  const { a, b, c } = Specificity.max(...Specificity.calculate(selectorOf(body.ltr))).value;
  const [sa, sb, sc] = body.rtl ? [a, b + 1, c + 1] : [a, b, c];
  return {
    name: `lobe-ui.l${level}-${sa}-${sb}-${sc}-p${String(priority).replace('.', '_')}`,
    sort: [level, sa, sb, sc, priority],
  };
};

const compareSort = (x: number[], y: number[]) => {
  for (const [index, value] of x.entries()) if (value !== y[index]) return value - y[index];
  return 0;
};

export const layerOrder = (rules: StylexRule[]) => {
  const keys = new Map<string, number[]>();
  for (const rule of rules) {
    if (isConstant(rule)) continue;
    const { name, sort } = layerKeyOf(rule);
    keys.set(name, sort);
  }
  return [...keys].toSorted(([, x], [, y]) => compareSort(x, y)).map(([name]) => name);
};

export const stylexRulesToCss = (
  rules: StylexRule[],
  { constants = [], order }: { constants?: StylexRule[]; order: string[] },
) => {
  const atoms = rules.filter((rule) => !isConstant(rule));
  if (atoms.length === 0) return '';
  const allConstants = [...constants, ...rules.filter(isConstant)];
  const groups = Map.groupBy(atoms, (rule) => layerKeyOf(rule).name);
  const body = order
    .filter((name) => groups.has(name))
    .map((name) => {
      const css = processStylexRules([...allConstants, ...groups.get(name)!], {
        legacyDisableLayers: true,
      });
      return `@layer ${name} {\n${css}\n}`;
    })
    .join('\n');

  const css = transform({
    code: Buffer.from(body),
    exclude: stylexOptions.lightningcssOptions.exclude,
    filename: 'stylex.css',
    targets,
  }).code.toString();
  return `@layer ${order.join(', ')};\n\n${css}`;
};
