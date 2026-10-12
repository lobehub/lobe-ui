import type { StringLiteral } from '@babel/types';

import { moduleSources, walk } from '../../ast';
import type { Rule, RuleContext } from '../../report';
import {
  ANTD_STYLE_TYPE_RENAMES,
  SUPPORTED_ANTD_STYLE_VALUES,
} from '../../transforms/v6/antdStyle';
import antdMap from '../../transforms/v6/data/antd-map.json';

const map = antdMap as Record<string, string>;

const ANTD_STYLE_HANDLED_ELSEWHERE = new Set(['StyleProvider', 'ThemeProvider']);

const ANTD_STYLE_FIXES: Record<string, string> = {
  createStyles: 'rewrite with createStaticStyles + cssVar',
  createStylish: 'write plain `css` fragments on `cssVar`',
  useAntdToken: 'use `cssVar` or `useTheme()`',
};

const antdHint = (name: string) => {
  const target = map[name];
  if (target) return `antd \`${name}\` → ${target}.`;
  if (/(Props|Ref|Type)$/.test(name)) {
    return `antd type \`${name}\` → use the props type of the matching @lobehub/ui component.`;
  }
  return `antd \`${name}\` has no @lobehub/ui equivalent; rebuild it or drop it.`;
};

const packageHint = (source: string) => {
  if (/^antd\/dist\/reset\.css$/.test(source)) {
    return `\`${source}\` → import \`@lobehub/ui/global.css\` instead; it includes the antd reset.`;
  }
  if (/^antd\/(es\/|lib\/)?locale(\/|$)/.test(source)) {
    return `\`${source}\` is not needed; component strings come from ConfigProvider \`resources\` / \`locale\`.`;
  }
  if (source === '@ant-design/cssinjs') {
    return '`@ant-design/cssinjs` only extracted antd styles for SSR; remove it, theme.css and style.css are static.';
  }
  if (source.startsWith('@ant-design/')) {
    return source === '@ant-design/icons'
      ? '`@ant-design/icons` is not part of the @lobehub/ui stack; use lucide-react icons with Icon.'
      : `\`${source}\` is not part of the @lobehub/ui stack; remove it.`;
  }
  if (/^(rc-|@rc-component\/)/.test(source)) {
    return `\`${source}\` is an antd internal; replace it with the matching @lobehub/ui component.`;
  }
  return `\`${source}\` is antd; replace it with the matching @lobehub/ui component.`;
};

const ANTD_FAMILY = /^(antd($|\/)|antd-style($|\/)|@ant-design\/|rc-|@rc-component\/)/;

const otherReferenceHint = (source: string) =>
  /^antd-style($|\/)/.test(source)
    ? `\`${source}\` is antd-style; import the helpers from @lobehub/ui instead (re-exports, require and deep imports are not rewritten).`
    : packageHint(source);

const reportOtherReferences = ({ ast, report }: RuleContext, handled: Set<StringLiteral>) => {
  for (const source of moduleSources(ast)) {
    if (!handled.has(source) && ANTD_FAMILY.test(source.value)) {
      report(source, {
        anchor: 'components',
        message: otherReferenceHint(source.value),
        rule: 'R6',
      });
    }
  }
  walk(ast, (node) => {
    if (
      node.type === 'TSModuleDeclaration' &&
      node.id.type === 'StringLiteral' &&
      ANTD_FAMILY.test(node.id.value)
    ) {
      report(node, {
        anchor: 'styling-api',
        message: `\`declare module '${node.id.value}'\` augments a package v6 no longer uses; move the declarations or delete them.`,
        rule: 'R6',
      });
    }
  });
};

export const antdImports: Rule = (ctx) => {
  const { ast, report } = ctx;
  const handled = new Set<StringLiteral>();
  for (const node of ast.program.body) {
    if (node.type !== 'ImportDeclaration') continue;
    const source = node.source.value;
    if (!ANTD_FAMILY.test(source)) continue;
    handled.add(node.source);

    if (source === 'antd-style' && node.specifiers.length === 0) {
      report(node, {
        anchor: 'styling-api',
        message: '`antd-style` side-effect import; delete it.',
        rule: 'R6',
      });
      continue;
    }

    if (source === 'antd-style') {
      for (const specifier of node.specifiers) {
        const name =
          specifier.type === 'ImportSpecifier'
            ? specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : specifier.imported.value
            : '*';
        if (ANTD_STYLE_HANDLED_ELSEWHERE.has(name) || SUPPORTED_ANTD_STYLE_VALUES.has(name))
          continue;
        report(specifier, {
          anchor: 'styling-api',
          message: ANTD_STYLE_TYPE_RENAMES[name]
            ? `antd-style \`${name}\` → \`${ANTD_STYLE_TYPE_RENAMES[name]}\` from @lobehub/ui. Not rewritten because the name is shadowed, re-exported or already taken in this file.`
            : name === '*'
              ? 'Default / namespace imports of antd-style are not rewritten; import the named helpers from @lobehub/ui.'
              : `antd-style \`${name}\` has no @lobehub/ui equivalent; ${ANTD_STYLE_FIXES[name] ?? 'replace it by hand'}.`,
          rule: 'R6',
        });
      }
      continue;
    }

    if (source === 'antd') {
      const named = node.specifiers.filter((s) => s.type === 'ImportSpecifier');
      for (const specifier of named) {
        const name =
          specifier.imported.type === 'Identifier'
            ? specifier.imported.name
            : specifier.imported.value;
        report(specifier, { anchor: 'components', message: antdHint(name), rule: 'R6' });
      }
      if (named.length === node.specifiers.length && named.length > 0) continue;
    }

    const onlyStyleProvider =
      node.specifiers.length > 0 &&
      node.specifiers.every(
        (s) =>
          s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'StyleProvider',
      );
    if (!onlyStyleProvider) {
      report(node, { anchor: 'components', message: otherReferenceHint(source), rule: 'R6' });
    }
  }
  reportOtherReferences(ctx, handled);
};
