import type { Rule } from 'eslint';

const REPLACEMENTS: Record<string, string> = {
  '@lobehub/ui/base-ui': '@lobehub/ui',
  '@lobehub/ui/base-ui/form': '@lobehub/ui/form',
};

export const noBaseUiSubpath: Rule.RuleModule = {
  create(context) {
    const check = (source: any) => {
      if (source?.type !== 'Literal' || typeof source.value !== 'string') return;
      const replacement = REPLACEMENTS[source.value];
      if (!replacement) return;
      context.report({
        fix: (fixer) => fixer.replaceText(source, `${source.raw[0]}${replacement}${source.raw[0]}`),
        message: `"${source.value}" was removed. Import from "${replacement}" instead.`,
        node: source,
      });
    };

    return {
      ExportAllDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ImportDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source),
    };
  },
  meta: { fixable: 'code', type: 'problem' },
};
