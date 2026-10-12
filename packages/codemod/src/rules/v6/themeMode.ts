import { walk } from '../../ast';
import type { Rule } from '../../report';

const REMOVED_KEYS: Record<string, Record<string, string>> = {
  useTheme: {
    prefixCls: '`prefixCls` is gone with antd; drop it',
    stylish: '`stylish` is gone; use plain `css` fragments on `cssVar`',
  },
  useThemeMode: {
    setThemeMode:
      '`setThemeMode` is gone; call setLobeTheme({ appearance }) or your next-themes setter',
    themeMode:
      '`themeMode` is gone; read `appearance` / `isDarkMode`, keep the "auto" choice in app state',
  },
};

export const themeMode: Rule = ({ ast, report }) => {
  walk(ast, (node) => {
    if (node.type !== 'VariableDeclarator' || node.id.type !== 'ObjectPattern') return;
    const { init } = node;
    if (init?.type !== 'CallExpression' || init.callee.type !== 'Identifier') return;
    const keys = REMOVED_KEYS[init.callee.name];
    if (!keys) return;
    for (const property of node.id.properties) {
      if (property.type !== 'ObjectProperty' || property.key.type !== 'Identifier') continue;
      const fix = keys[property.key.name];
      if (fix) report(property, { anchor: 'styling-api', message: `${fix}.`, rule: 'R8' });
    }
  });
};
