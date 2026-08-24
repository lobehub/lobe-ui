import { describe, expect, it } from 'vitest';

import { ANTD_STATIC_CSS_MODULE_ID, lobeStaticCssPlugin, THEME_VARS_CSS_MODULE_ID } from './index';

type Hook = (this: unknown, id: string) => unknown;

const callHook = (hook: unknown, id: string) => (hook as Hook).call(undefined, id);

describe('lobeStaticCssPlugin', () => {
  it('resolves both virtual module ids', () => {
    const plugin = lobeStaticCssPlugin();

    expect(callHook(plugin.resolveId, ANTD_STATIC_CSS_MODULE_ID)).toBe(
      `\0${ANTD_STATIC_CSS_MODULE_ID}`,
    );
    expect(callHook(plugin.resolveId, THEME_VARS_CSS_MODULE_ID)).toBe(
      `\0${THEME_VARS_CSS_MODULE_ID}`,
    );
    expect(callHook(plugin.resolveId, 'other')).toBeUndefined();
  });

  it('serves antd payload with explicit probes', async () => {
    const plugin = lobeStaticCssPlugin({ antd: { included: ['button'] }, themeVars: false });

    const code = (await callHook(plugin.load, `\0${ANTD_STATIC_CSS_MODULE_ID}`)) as string;

    expect(code).toContain('export const css = ');
    expect(code).toContain('export const styleKeys = ');
    expect(code).toContain('/antd.css?v=');
  });

  it('serves empty stubs when a target is disabled', async () => {
    const plugin = lobeStaticCssPlugin({ antd: false, themeVars: false });

    const antdCode = (await callHook(plugin.load, `\0${ANTD_STATIC_CSS_MODULE_ID}`)) as string;
    const themeCode = (await callHook(plugin.load, `\0${THEME_VARS_CSS_MODULE_ID}`)) as string;

    expect(antdCode).toContain('export const css = ""');
    expect(themeCode).toContain('export const css = ""');
  });
});
