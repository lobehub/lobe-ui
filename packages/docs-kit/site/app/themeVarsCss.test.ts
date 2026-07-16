import { expect, it } from 'vitest';

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
