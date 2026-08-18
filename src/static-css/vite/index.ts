import type { Plugin } from 'vite';

import type { AntdStaticCssOptions, AntdStaticCssPayload } from '../buildAntdStaticCss';
import type { ThemeVarsCssOptions, ThemeVarsCssPayload } from '../themeVars';

export const ANTD_STATIC_CSS_MODULE_ID = 'virtual:lobehub/antd-static-css';
export const THEME_VARS_CSS_MODULE_ID = 'virtual:lobehub/theme-vars-css';

export interface StaticCssPluginOptions {
  antd?: AntdStaticCssOptions | false;
  themeVars?: ThemeVarsCssOptions | false;
}

const moduleSource = (payload: Record<string, unknown>) =>
  [
    ...Object.entries(payload).map(
      ([key, value]) => `export const ${key} = ${JSON.stringify(value)};`,
    ),
    `export default ${JSON.stringify(payload)};`,
  ].join('\n');

export const lobeStaticCssPlugin = (options: StaticCssPluginOptions = {}): Plugin => {
  let antdPayload: AntdStaticCssPayload | undefined;
  let themeVarsPayload: ThemeVarsCssPayload | undefined;

  return {
    name: 'lobehub-static-css',
    resolveId(id) {
      if (id === ANTD_STATIC_CSS_MODULE_ID || id === THEME_VARS_CSS_MODULE_ID) return `\0${id}`;
    },
    async load(id) {
      if (id === `\0${ANTD_STATIC_CSS_MODULE_ID}`) {
        if (options.antd === false) return moduleSource({ css: '', href: '', styleKeys: [] });
        const { buildAntdStaticCss } = await import('../buildAntdStaticCss');
        antdPayload ??= buildAntdStaticCss(options.antd);
        const { css, href, styleKeys } = antdPayload;
        return moduleSource({ css, href, styleKeys });
      }

      if (id === `\0${THEME_VARS_CSS_MODULE_ID}`) {
        if (options.themeVars === false) return moduleSource({ css: '', href: '' });
        const { buildThemeVarsCss } = await import('../themeVars');
        themeVarsPayload ??= buildThemeVarsCss(options.themeVars);
        const { css, href } = themeVarsPayload;
        return moduleSource({ css, href });
      }
    },
  };
};
