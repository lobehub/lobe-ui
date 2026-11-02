// @vitest-environment node
import { createRequire } from 'node:module';

import { layerOrder, type StylexRule, stylexRulesToCss } from './stylexCss';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const { transformSync } = unpluginRequire('@babel/core');
const stylexBabel = unpluginRequire('@stylexjs/babel-plugin');
const syntaxTs = unpluginRequire('@babel/plugin-syntax-typescript');

const compile = (styles: string): StylexRule[] =>
  transformSync(
    `import * as stylex from '@stylexjs/stylex';\nexport const s = stylex.create(${styles});`,
    {
      babelrc: false,
      filename: '/virtual/a.ts',
      plugins: [syntaxTs, [stylexBabel, { classNamePrefix: 'lb', dev: false }]],
    },
  ).metadata.stylex;

const ruleFor = (rules: StylexRule[], pattern: RegExp) => {
  const rule = rules.find(([, body]) => pattern.test(body.ltr));
  if (!rule) throw new Error(`no rule matches ${pattern}`);
  return rule;
};

const layerHolding = (css: string, className: string) => {
  const before = css.slice(0, css.indexOf(`.${className}`));
  const layer = [...before.matchAll(/@layer (lobe-ui\.[\w-]+) \{/g)].at(-1);
  if (!layer) throw new Error(`.${className} is not inside a lobe-ui sublayer`);
  return layer[1];
};

const render = (rules: StylexRule[]) => stylexRulesToCss(rules, { order: layerOrder(rules) });

describe('layerOrder', () => {
  it('keeps the order one StyleX sheet gives the conditions of a property', () => {
    const rules = compile(`{
      a: {
        color: {
          default: 'red',
          ':hover': 'blue',
          ':focus-within': 'gray',
          '@supports (color: red)': 'teal',
          '@container (min-width: 1px)': 'navy',
          [stylex.when.ancestor(':hover')]: 'green',
        },
      },
    }`);
    const css = render(rules);
    const order = layerOrder(rules);
    const byLayer = rules
      .toSorted(
        (x, y) => order.indexOf(layerHolding(css, x[0])) - order.indexOf(layerHolding(css, y[0])),
      )
      .map(([, , priority]) => priority);

    expect(byLayer).toEqual(rules.map(([, , priority]) => priority).toSorted((x, y) => x - y));
  });

  it('puts a more specific atom above a higher priority of the same level', () => {
    const plain: StylexRule = ['a1', { ltr: '.a1{color:red}', rtl: null }, 3200];
    const hover: StylexRule = ['b1', { ltr: '.b1:hover{color:blue}', rtl: null }, 3100];
    const order = layerOrder([plain, hover]);
    const css = stylexRulesToCss([plain, hover], { order });

    expect(order.indexOf(layerHolding(css, 'a1'))).toBeLessThan(
      order.indexOf(layerHolding(css, 'b1')),
    );
  });

  it('keeps a longhand above a more specific shorthand', () => {
    const rules = compile(`{ a: { margin: { default: 0, ':hover': 4 }, marginTop: 8 } }`);
    const css = render(rules);
    const order = layerOrder(rules);
    const shorthandHover = ruleFor(rules, /:hover\{margin:/)[0];
    const longhand = ruleFor(rules, /margin-top:/)[0];

    expect(order.indexOf(layerHolding(css, shorthandHover))).toBeLessThan(
      order.indexOf(layerHolding(css, longhand)),
    );
  });
});

describe('stylexRulesToCss', () => {
  it('declares the whole layer order even in a file that uses one layer', () => {
    const all = compile(`{ a: { color: { default: 'red', ':hover': 'blue' }, margin: 4 } }`);
    const order = layerOrder(all);
    const onlyColor = all.filter(([, body]) => /\{color:red/.test(body.ltr));
    const css = stylexRulesToCss(onlyColor, { order });

    expect(css.startsWith(`@layer ${order.join(', ')};`)).toBe(true);
    expect(order.length).toBeGreaterThan(1);
  });

  it('wraps keyframes in the first sublayer so nothing is left unlayered', () => {
    const rules = compile(`{ a: { animationName: stylex.keyframes({ to: { opacity: 0 } }) } }`);
    const css = render(rules);
    const unlayered = css
      .replaceAll(/^@layer [^{;]+;\n/gm, '')
      .replaceAll(/@layer [^{]+\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g, '')
      .trim();

    expect(css).toMatch(/@layer lobe-ui\.[\w-]+ \{\s*@keyframes/);
    expect(unlayered).toBe('');
  });

  it('resolves a defineConsts reference whose constant lives in another module', () => {
    const constant: StylexRule = ['c1', { constKey: 'c1', constVal: '#123456', ltr: '' }, 0];
    const rule: StylexRule = ['x1', { ltr: '.x1{color:var(--c1)}', rtl: null }, 3000];
    const css = stylexRulesToCss([rule], { constants: [constant], order: layerOrder([rule]) });

    expect(css).toMatch(/\.x1\s*\{\s*color:\s*#123456/);
  });
});
