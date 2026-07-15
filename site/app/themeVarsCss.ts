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

export const buildThemeVarsCss = () => {
  const componentVars = buildDarkComponentVars();

  return [
    [
      ':root',
      "html[data-theme='light'] [class*='css-var-']",
      "html[data-theme='light'] .ant-app",
    ].join(',') + `{${themeCssVarPalettes.light}}`,
    [
      "html[data-theme='dark']",
      "html[data-theme='dark'] [class*='css-var-']",
      "html[data-theme='dark'] .ant-app",
    ].join(',') + `{${themeCssVarPalettes.dark}}`,
    `html[data-theme='dark'] [class*='css-var-']{${componentVars}}`,
    [
      "html[data-theme='dark'] .ant-btn-primary:not(:disabled)",
      "html[data-theme='dark'] .ant-btn-primary:not(:disabled):hover",
      "html[data-theme='dark'] .ant-btn-primary:not(:disabled):active",
    ].join(',') + `{color:${darkReadableOnPrimary} !important;}`,
    `html[data-theme='dark'] .ant-checkbox-inner:after{border-color:${darkReadableOnPrimary} !important;}`,
    `html[data-theme='dark'] .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after{background:${darkReadableOnPrimary};}`,
  ].join('\n');
};

let cache: string | undefined;

export const getThemeVarsCss = () => {
  cache ??= buildThemeVarsCss();
  return cache;
};
