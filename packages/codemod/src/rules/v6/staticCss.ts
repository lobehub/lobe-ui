import { namedImports } from '../../ast';
import type { Rule } from '../../report';

export const REMOVED_TOKEN_HELPERS: Record<string, string> = {
  createLobeAntdTheme: 'there is no antd theme to configure anymore; delete it',
  lobeCustomStylish: 'write plain `css` fragments on `cssVar` (lobeStaticStylish still exists)',
  lobeCustomToken: 'read values through `cssVar` or `useTheme()`',
};

export const staticCss: Rule = ({ ast, report }) => {
  for (const node of ast.program.body) {
    if (
      node.type === 'ImportDeclaration' &&
      node.source.value.startsWith('@lobehub/ui/static-css')
    ) {
      report(node, {
        anchor: 'removed-apis',
        message: `\`${node.source.value}\` was removed. \`@lobehub/ui/theme.css\` ships the token variables statically; drop the build plugin and its runtime.`,
        rule: 'R3',
      });
    }
  }
  for (const { name, specifier } of namedImports(ast, (s) => s === '@lobehub/ui')) {
    const fix = REMOVED_TOKEN_HELPERS[name];
    if (fix)
      report(specifier, {
        anchor: 'removed-apis',
        message: `\`${name}\` was removed: ${fix}.`,
        rule: 'R3',
      });
  }
};
