import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import {
  darkReadableOnPrimary,
  lobeThemeTokens,
  themeCssVarPalettes,
  toKebabCase,
} from './providers/themeTokens';

const require = createRequire(import.meta.url);

const getAntdPackageRoot = () => path.dirname(require.resolve('antd/package.json'));

const loadAntdTokenModules = () => {
  const antdLibDir = path.join(getAntdPackageRoot(), 'lib');

  return readdirSync(antdLibDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => ({
      component: name,
      path: path.join(antdLibDir, name, 'style', 'token.js'),
    }))
    .filter(({ path: tokenPath }) => existsSync(tokenPath));
};

const buildDarkComponentVars = () => {
  const declarations: string[] = [];
  const skipped: string[] = [];

  for (const { component, path } of loadAntdTokenModules()) {
    try {
      const mod = require(path) as { prepareComponentToken?: unknown };
      const prepare = mod.prepareComponentToken;
      if (typeof prepare !== 'function') continue;

      const light = prepare(lobeThemeTokens.light) as Record<string, unknown>;
      const dark = prepare(lobeThemeTokens.dark) as Record<string, unknown>;

      for (const [key, value] of Object.entries(dark)) {
        if (typeof value !== 'string' || light[key] === value) continue;
        declarations.push(`--ant-${component}-${toKebabCase(key)}:${value};`);
      }
    } catch (error) {
      skipped.push(
        `${component} (${error instanceof Error ? error.message.split('\n')[0] : error})`,
      );
    }
  }

  if (skipped.length > 0) {
    console.warn(`[theme-vars-css] skipped component tokens: ${skipped.join(', ')}`);
  }

  return declarations.join('');
};

// A demo can force its own appearance independently of the site theme (see
// `DemoEnvironment`, which stamps `data-lobe-demo-appearance` on the demo
// subtree). The site-wide `[data-theme]`-keyed rules below match any
// `[class*="css-var-"]`/`.ant-app` element by attribute selector, which beats
// the antd-generated per-instance scope rule on specificity alone — so
// without this exclusion a demo forced to the opposite appearance would have
// its tokens silently overwritten back to the site theme. The demo-scoped
// rules further down reapply the correct palette unconditionally.
const DEMO_SCOPE_EXCLUSION = ':not([data-lobe-demo-appearance] *)';

export const buildThemeVarsCss = () => {
  const componentVars = buildDarkComponentVars();

  return [
    [
      ':root',
      `html[data-theme='light'] [class*='css-var-']${DEMO_SCOPE_EXCLUSION}`,
      `html[data-theme='light'] .ant-app${DEMO_SCOPE_EXCLUSION}`,
    ].join(',') + `{${themeCssVarPalettes.light}}`,
    [
      "html[data-theme='dark']",
      `html[data-theme='dark'] [class*='css-var-']${DEMO_SCOPE_EXCLUSION}`,
      `html[data-theme='dark'] .ant-app${DEMO_SCOPE_EXCLUSION}`,
    ].join(',') + `{${themeCssVarPalettes.dark}}`,
    `html[data-theme='dark'] [class*='css-var-']${DEMO_SCOPE_EXCLUSION}{${componentVars}}`,
    [
      `html[data-theme='dark'] .ant-btn-primary:not(:disabled)${DEMO_SCOPE_EXCLUSION}`,
      `html[data-theme='dark'] .ant-btn-primary:not(:disabled):hover${DEMO_SCOPE_EXCLUSION}`,
      `html[data-theme='dark'] .ant-btn-primary:not(:disabled):active${DEMO_SCOPE_EXCLUSION}`,
    ].join(',') + `{color:${darkReadableOnPrimary} !important;}`,
    `html[data-theme='dark'] .ant-checkbox-inner:after${DEMO_SCOPE_EXCLUSION}{border-color:${darkReadableOnPrimary} !important;}`,
    `html[data-theme='dark'] .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after${DEMO_SCOPE_EXCLUSION}{background:${darkReadableOnPrimary};}`,
    [
      "[data-lobe-demo-appearance='light'] [class*='css-var-']",
      "[data-lobe-demo-appearance='light'].ant-app",
      "[data-lobe-demo-appearance='light'] .ant-app",
    ].join(',') + `{${themeCssVarPalettes.light}}`,
    [
      "[data-lobe-demo-appearance='dark'] [class*='css-var-']",
      "[data-lobe-demo-appearance='dark'].ant-app",
      "[data-lobe-demo-appearance='dark'] .ant-app",
    ].join(',') + `{${themeCssVarPalettes.dark}}`,
    `[data-lobe-demo-appearance='dark'] [class*='css-var-']{${componentVars}}`,
    [
      "[data-lobe-demo-appearance='dark'] .ant-btn-primary:not(:disabled)",
      "[data-lobe-demo-appearance='dark'] .ant-btn-primary:not(:disabled):hover",
      "[data-lobe-demo-appearance='dark'] .ant-btn-primary:not(:disabled):active",
    ].join(',') + `{color:${darkReadableOnPrimary} !important;}`,
    `[data-lobe-demo-appearance='dark'] .ant-checkbox-inner:after{border-color:${darkReadableOnPrimary} !important;}`,
    `[data-lobe-demo-appearance='dark'] .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after{background:${darkReadableOnPrimary};}`,
  ].join('\n');
};

let cache: string | undefined;

export const getThemeVarsCss = () => {
  cache ??= buildThemeVarsCss();
  return cache;
};
