import { toCssVariables } from '../css';
import { neutralColors, primaryColors } from '../customTheme';
import { createLobeToken, type CreateLobeTokenParams } from './createLobeToken';
import { getGlobalCss, getThemeCss } from './themeCss';

const parseRules = () => {
  const rules = new Map<string, Record<string, string>>();
  for (const [, selector, body] of getThemeCss().matchAll(/^([^\s@{][^{]*)\{\n([^}]*)\n\}/gm)) {
    const declarations = Object.fromEntries(
      [...body.matchAll(/^\s*(--lobe-[\w-]+): (.*);$/gm)].map(([, name, value]) => [name, value]),
    );
    rules.set(selector.trim(), declarations);
  }
  return rules;
};

const resolve = (
  rules: Map<string, Record<string, string>>,
  { appearance, neutralColor, primaryColor }: CreateLobeTokenParams,
) => {
  const mode = appearance === 'dark' ? "[data-theme='dark']" : ":not([data-theme='dark'])";
  const vars = {
    ...rules.get(":root, [data-theme='light']"),
    ...(appearance === 'dark' ? rules.get("[data-theme='dark']") : {}),
    ...(primaryColor ? rules.get(`[data-primary-color='${primaryColor}']${mode}`) : {}),
    ...(neutralColor ? rules.get(`[data-neutral-color='${neutralColor}']${mode}`) : {}),
  };
  delete vars['--lobe-ring'];
  return vars;
};

describe('getThemeCss', () => {
  const rules = parseRules();
  const variants = (['light', 'dark'] as const).flatMap((appearance): CreateLobeTokenParams[] => [
    { appearance },
    ...(Object.keys(primaryColors) as (keyof typeof primaryColors)[]).map((primaryColor) => ({
      appearance,
      primaryColor,
    })),
    ...(Object.keys(neutralColors) as (keyof typeof neutralColors)[]).map((neutralColor) => ({
      appearance,
      neutralColor,
    })),
  ]);

  it.each(variants)('resolves %o to createLobeToken', (params) => {
    expect(resolve(rules, params)).toEqual(toCssVariables(createLobeToken(params)));
  });

  it('keeps document resets out of theme.css', () => {
    expect(getThemeCss()).not.toMatch(/^\s*(html|body|\*)\s*\{/m);
    expect(getGlobalCss()).toMatch(/^\s*body\s*\{/m);
  });

  it('gives body and nested theme scopes the root typography in the lowest layer', () => {
    const block = getThemeCss().match(
      /@layer lobe-base \{[^@]*?:where\(body, body \[data-theme\]\) \{([^}]*)\}/,
    );
    expect(block?.[1]).toContain('color: var(--lobe-color-text');
    expect(block?.[1]).toContain('font-family: var(--lobe-font-family');
    expect(block?.[1]).toContain('font-size: var(--lobe-font-size');
    expect(block?.[1]).toContain('line-height: var(--lobe-line-height');
    expect(getThemeCss()).not.toMatch(/:where\([^)]*\bhtml\b/);
  });

  it('styles links like the antd App wrapper did, in the lowest layer', () => {
    const base = getThemeCss().match(/@layer lobe-base \{([\s\S]*?)\n\}/)?.[1];

    expect(base).toMatch(
      /:where\(body\) :where\(a\) \{[^}]*color: var\(--lobe-color-link\);[^}]*text-decoration: none;/,
    );
    expect(base).toMatch(/:where\(body\) :where\(a\):hover \{[^}]*var\(--lobe-color-link-hover\)/);
  });

  it('ships the antd reset in global.css without fighting the root typography', () => {
    const globalCss = getGlobalCss();
    const body = globalCss.match(/\n {2}body \{([^}]*)\}/)?.[1];

    expect(body).toBeDefined();
    expect(body).not.toMatch(/(^|\s)(line-height|font-size|font-family|color):/);
    expect(globalCss).toMatch(
      /input,\s*button,\s*select,\s*optgroup,\s*textarea \{[^}]*font-family: inherit;/,
    );
    expect(globalCss).toMatch(/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6 \{[^}]*margin-block: 0 0\.5em;/);
    expect(globalCss).toMatch(/\[hidden\] \{\s*display: none !important;/);
  });

  it('orders the lobe layers so components beat popup and base helpers', () => {
    const order = '@layer lobe-base, lobe-popup, lobe-ui;';
    expect(getThemeCss().startsWith(order)).toBe(true);
    expect(getGlobalCss().startsWith(order)).toBe(true);
    expect(getGlobalCss()).toMatch(/@layer lobe-base \{\n\s*:root/);
  });
});
