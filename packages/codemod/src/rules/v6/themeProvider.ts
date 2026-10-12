import { namedImports } from '../../ast';
import type { Rule } from '../../report';

const SOURCES = new Set(['@lobehub/ui', 'antd-style']);
export const THEME_PROVIDER_NAMES = new Set(['ThemeProvider', 'ThemeProviderProps']);

export const themeProvider: Rule = ({ ast, report }) => {
  for (const { name, specifier } of namedImports(ast, (s) => SOURCES.has(s))) {
    if (!THEME_PROVIDER_NAMES.has(name)) continue;
    report(specifier, {
      anchor: 'theming',
      message:
        '`ThemeProvider` was removed. Import `@lobehub/ui/theme.css` once, set `data-theme` with setLobeTheme / LobeThemeScript (ThemeScope for islands); fonts and the portal host move to ConfigProvider.',
      rule: 'R1',
    });
  }
};
