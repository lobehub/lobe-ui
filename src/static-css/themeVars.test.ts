import { describe, expect, it } from 'vitest';

import { buildThemeVarsCss } from './themeVars';

describe('buildThemeVarsCss', () => {
  const payload = buildThemeVarsCss();

  it('emits both palettes with antd shadow selectors', () => {
    expect(payload.css).toContain(":root,html[data-theme='light'] [class*='css-var-']");
    expect(payload.css).toContain(
      "html[data-theme='dark'],html[data-theme='dark'] [class*='css-var-']",
    );
    expect(payload.css).toContain('--ant-color-primary:');
    expect(payload.href).toBe(`/theme-vars.css?v=${payload.hash}`);
  });

  it('emits dark component token diffs', () => {
    expect(payload.css).toMatch(/html\[data-theme='dark'] \[class\*='css-var-']\{--ant-\w/);
  });

  it('includes compat rules by default and drops them on demand', () => {
    expect(payload.css).toContain('.ant-btn-primary:not(:disabled)');

    const bare = buildThemeVarsCss({ compatRules: false });
    expect(bare.css).not.toContain('.ant-btn-primary');
    expect(bare.hash).not.toBe(payload.hash);
  });

  it('honors a custom appearance selector', () => {
    const custom = buildThemeVarsCss({
      appearanceSelector: (appearance) => `.theme-${appearance}`,
    });

    expect(custom.css).toContain('.theme-dark,');
    expect(custom.css).not.toContain('data-theme');
  });

  it('reports skipped components instead of warning', () => {
    expect(Array.isArray(payload.skippedComponents)).toBe(true);
  });
});
