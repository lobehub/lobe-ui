import {
  createStaticStyles as createAntdStaticStyles,
  css,
  cx,
  injectGlobal,
  keyframes,
} from 'antd-style';

import { createLobeToken, type LobeToken } from './theme/createLobeToken';

const UNITLESS = new Set([
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

const IGNORED = new Set(['motionBase', 'motionUnit']);

export const toKebabCase = (str: string) =>
  str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([a-z])(\d)/g, '$1-$2')
    .replaceAll(/(\d)([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

export const toCssVarName = (key: string) => `--lobe-${toKebabCase(key)}`;

export const toCssVariables = (token: Record<string, number | string>) =>
  Object.fromEntries(
    Object.entries(token)
      .filter(([key]) => !IGNORED.has(key))
      .map(([key, value]) => [
        toCssVarName(key),
        typeof value === 'number' && !UNITLESS.has(key)
          ? `${value}px`
          : String(value).replaceAll(/\s+/g, ' ').trim(),
      ]),
  );

export type LobeCssVar = Record<Exclude<keyof LobeToken, 'motionBase' | 'motionUnit'>, string>;

export const cssVar = Object.fromEntries(
  Object.keys(createLobeToken({ appearance: 'light' }))
    .filter((key) => !IGNORED.has(key))
    .map((key) => [key, `var(${toCssVarName(key)})`]),
) as LobeCssVar;

const breakpoints = {
  xs: '@media (max-width: 479.98px)',
  sm: '@media (max-width: 575.98px)',
  md: '@media (max-width: 767.98px)',
  lg: '@media (max-width: 991.98px)',
  xl: '@media (max-width: 1199.98px)',
  xxl: '@media (min-width: 1200px)',
};

export const responsive = {
  ...breakpoints,
  desktop: breakpoints.xxl,
  laptop: breakpoints.lg,
  mobile: breakpoints.xs,
  tablet: breakpoints.md,
};

export interface StaticStyleUtils {
  css: (template: TemplateStringsArray, ...args: any[]) => string;
  cssVar: LobeCssVar;
  cx: (...classNames: any[]) => string;
  responsive: typeof responsive;
}

let staticCss!: StaticStyleUtils['css'];
let staticCx!: StaticStyleUtils['cx'];

// antd-style's top-level `css` returns SerializedStyles; only its static instance yields class names
createAntdStaticStyles((utils) => {
  staticCss = utils.css;
  staticCx = utils.cx;
  return {};
});

export const createStaticStyles = <T>(stylesFn: (utils: StaticStyleUtils) => T): T =>
  stylesFn({ css: staticCss, cssVar, cx: staticCx, responsive });

export { css, cx, injectGlobal, keyframes };
