import { afterEach, expect, it } from 'vitest';

import { lobeThemeTokens } from './providers/themeTokens';
import { buildThemeVarsCss, getThemeVarsCss } from './themeVarsCss';

it('emits light and dark ant token palettes keyed by data-theme', () => {
  const css = buildThemeVarsCss();

  expect(css).toContain(':root');
  expect(css).toContain("html[data-theme='light'] .ant-app");
  expect(css).toContain("html[data-theme='dark'] .ant-app");
  expect(css).toContain('--ant-color-bg-container:');
  expect(css).toMatch(/html\[data-theme='dark'\][^{]*\{[^}]*--ant-color-bg-container:\s*#/);
});

it('memoizes the generated stylesheet', () => {
  expect(getThemeVarsCss()).toBe(getThemeVarsCss());
});

it('emits demo-scoped palettes that stay independent of the site-wide data-theme rules', () => {
  const css = buildThemeVarsCss();

  expect(css).toContain("[data-lobe-demo-appearance='light'] .ant-app");
  expect(css).toContain("[data-lobe-demo-appearance='dark'] .ant-app");
  expect(css).toContain(':not([data-lobe-demo-appearance] *)');
});

afterEach(() => {
  document.head.querySelectorAll('style[data-theme-vars-test]').forEach((node) => node.remove());
  document.body.innerHTML = '';
  delete document.documentElement.dataset.theme;
});

it('keeps a demo forced to light readable even while the site is dark', () => {
  const style = document.createElement('style');
  style.dataset.themeVarsTest = '';
  style.textContent = buildThemeVarsCss();
  document.head.append(style);
  document.documentElement.dataset.theme = 'dark';

  const demoScope = document.createElement('div');
  demoScope.setAttribute('data-lobe-demo-appearance', 'light');
  const antApp = document.createElement('div');
  antApp.className = 'ant-app css-var-test-scope';
  demoScope.append(antApp);
  document.body.append(demoScope);

  expect(getComputedStyle(antApp).getPropertyValue('--ant-color-bg-container').trim()).toBe(
    String(lobeThemeTokens.light.colorBgContainer),
  );
});

it('keeps a demo forced to dark themed even while the site is light', () => {
  const style = document.createElement('style');
  style.dataset.themeVarsTest = '';
  style.textContent = buildThemeVarsCss();
  document.head.append(style);
  document.documentElement.dataset.theme = 'light';

  const demoScope = document.createElement('div');
  demoScope.setAttribute('data-lobe-demo-appearance', 'dark');
  const antApp = document.createElement('div');
  antApp.className = 'ant-app css-var-test-scope';
  demoScope.append(antApp);
  document.body.append(demoScope);

  expect(getComputedStyle(antApp).getPropertyValue('--ant-color-bg-container').trim()).toBe(
    String(lobeThemeTokens.dark.colorBgContainer),
  );
});
