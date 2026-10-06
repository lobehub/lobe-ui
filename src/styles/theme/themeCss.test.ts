import { toCssVariables } from '../css';
import { neutralColors, primaryColors } from '../customTheme';
import { createLobeToken, type CreateLobeTokenParams } from './createLobeToken';
import { getThemeCss } from './themeCss';

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
});
