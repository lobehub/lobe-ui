import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

import { createLobeAntdTheme } from '@/styles/theme/antdTheme';

import { hashCss } from './hash';

type ThemeAppearance = 'dark' | 'light';

export interface ThemeVarsCssOptions {
  /** selector activating an appearance; default matches next-themes' data-theme attribute */
  appearanceSelector?: (appearance: ThemeAppearance) => string;
  /** dark fixups for lobe-ui antdOverride rules that keep literal polished-derived colors */
  compatRules?: boolean;
  hrefTemplate?: (hash: string) => string;
  /** same theme factory the app hands to ConfigProvider/ThemeProvider */
  theme?: (appearance: ThemeAppearance) => ThemeConfig;
}

export interface ThemeVarsCssPayload {
  css: string;
  hash: string;
  href: string;
  skippedComponents: string[];
}

const require = createRequire(import.meta.url);

const unitless = new Set([
  'fontWeightStrong',
  'lineHeight',
  'lineHeightHeading1',
  'lineHeightHeading2',
  'lineHeightHeading3',
  'lineHeightHeading4',
  'lineHeightHeading5',
  'lineHeightLG',
  'lineHeightSM',
  'opacityImage',
  'opacityLoading',
  'zIndexBase',
  'zIndexPopupBase',
]);

const ignoredTokens = new Set(['motionBase', 'motionUnit']);

// same kebab algorithm as antd-style's toKebabCase, so names match antd's emitted vars
export const toKebabCase = (str: string) =>
  str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([a-z])(\d)/g, '$1-$2')
    .replaceAll(/(\d)([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const defaultThemeFactory = (appearance: ThemeAppearance): ThemeConfig =>
  createLobeAntdTheme({ appearance });

const buildDesignToken = (
  themeFactory: (appearance: ThemeAppearance) => ThemeConfig,
  appearance: ThemeAppearance,
) => {
  const themeConfig = themeFactory(appearance);
  return antdTheme.getDesignToken({
    ...themeConfig,
    algorithm: [
      appearance === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      themeConfig.algorithm ?? [],
    ].flat(),
  }) as unknown as Record<string, number | string>;
};

const toDeclarations = (token: Record<string, number | string>) =>
  Object.entries(token)
    .filter(
      ([key, value]) =>
        !key.startsWith('_') &&
        !key.startsWith('screen') &&
        !key.includes('-') &&
        !ignoredTokens.has(key) &&
        (typeof value === 'string' || typeof value === 'number'),
    )
    .map(([key, value]) => {
      const cssValue =
        typeof value === 'number' && !unitless.has(key) ? `${value}px` : String(value);
      return `--ant-${toKebabCase(key)}: ${cssValue};`;
    })
    .join('\n');

const isBrightColor = (value: string) => {
  const hex = /^#([\da-f]{6})/i.exec(value)?.[1];
  const rgb = /^rgba?\((\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(value);
  const [r, g, b] = hex
    ? [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ]
    : rgb
      ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
      : [0, 0, 0];
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
};

const loadAntdTokenModules = () => {
  const antdLibDir = path.join(path.dirname(require.resolve('antd/package.json')), 'lib');

  return readdirSync(antdLibDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => ({ component: name, path: path.join(antdLibDir, name, 'style', 'token.js') }))
    .filter(({ path }) => existsSync(path));
};

const buildDarkComponentVars = (tokens: {
  dark: Record<string, number | string>;
  light: Record<string, number | string>;
}) => {
  const declarations: string[] = [];
  const skipped: string[] = [];

  for (const { component, path } of loadAntdTokenModules()) {
    try {
      const mod = require(path) as { prepareComponentToken?: unknown };
      const prepare = mod.prepareComponentToken;
      if (typeof prepare !== 'function') continue;

      const light = prepare(tokens.light) as Record<string, unknown>;
      const dark = prepare(tokens.dark) as Record<string, unknown>;

      for (const [key, value] of Object.entries(dark)) {
        if (typeof value !== 'string' || light[key] === value) continue;
        declarations.push(`--ant-${component}-${toKebabCase(key)}:${value};`);
      }
    } catch {
      skipped.push(component);
    }
  }

  return { css: declarations.join(''), skipped };
};

const buildCompatRules = (
  darkSelector: string,
  darkToken: Record<string, number | string>,
): string => {
  // mirrors polished's readableColor for the antdOverride rules that keep colorPrimary literal
  const readableOnPrimary = isBrightColor(String(darkToken.colorPrimary)) ? '#000' : '#fff';

  return [
    [
      `${darkSelector} .ant-btn-primary:not(:disabled)`,
      `${darkSelector} .ant-btn-primary:not(:disabled):hover`,
      `${darkSelector} .ant-btn-primary:not(:disabled):active`,
    ].join(',') + `{color:${readableOnPrimary} !important;}`,
    `${darkSelector} .ant-checkbox-inner:after{border-color:${readableOnPrimary} !important;}`,
    `${darkSelector} .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after{background:${readableOnPrimary};}`,
  ].join('\n');
};

export const buildThemeVarsCss = (options: ThemeVarsCssOptions = {}): ThemeVarsCssPayload => {
  const {
    theme = defaultThemeFactory,
    appearanceSelector = (appearance) => `html[data-theme='${appearance}']`,
    compatRules = true,
    hrefTemplate = (hash) => `/theme-vars.css?v=${hash}`,
  } = options;

  const tokens = {
    dark: buildDesignToken(theme, 'dark'),
    light: buildDesignToken(theme, 'light'),
  };

  const light = appearanceSelector('light');
  const dark = appearanceSelector('dark');
  const componentVars = buildDarkComponentVars(tokens);

  // antd v6 cssVar mode re-declares all --ant-* with SSR-light literals on
  // [class*='css-var-'] / .ant-app, which would shadow the html-level palettes
  const blocks = [
    [':root', `${light} [class*='css-var-']`, `${light} .ant-app`].join(',') +
      `{${toDeclarations(tokens.light)}}`,
    [dark, `${dark} [class*='css-var-']`, `${dark} .ant-app`].join(',') +
      `{${toDeclarations(tokens.dark)}}`,
    `${dark} [class*='css-var-']{${componentVars.css}}`,
  ];

  if (compatRules) blocks.push(buildCompatRules(dark, tokens.dark));

  const css = blocks.join('\n');
  const hash = hashCss(css);

  return { css, hash, href: hrefTemplate(hash), skippedComponents: componentVars.skipped };
};
