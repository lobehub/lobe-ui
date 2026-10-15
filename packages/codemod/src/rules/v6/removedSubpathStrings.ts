import { mockSources, moduleSources, walk } from '../../ast';
import type { Rule } from '../../report';
import { BASE_UI_REPLACEMENTS } from '../../transforms/v6/baseUiSubpath';

export const removedSubpathStrings: Rule = ({ ast, report }) => {
  for (const source of mockSources(ast)) {
    const replacement = BASE_UI_REPLACEMENTS[source.value];
    if (!replacement) continue;
    report(source, {
      anchor: 'removed-apis',
      message: `This file also mocks "${replacement}"; merge this "${source.value}" factory into that mock, then delete it.`,
      rule: 'R4',
    });
  }
  const sources = new Set(moduleSources(ast));
  walk(ast, (node) => {
    if (node.type !== 'StringLiteral' || sources.has(node)) return;
    const { value } = node;
    if (value === '@lobehub/ui/base-ui' || value.startsWith('@lobehub/ui/base-ui/')) {
      report(node, {
        anchor: 'removed-apis',
        message: `"${value}" was removed; this string (bundler config, alias, mock map?) still names it. Use "${value.replace('/base-ui', '')}".`,
        rule: 'R4',
      });
    } else if (value.startsWith('@lobehub/ui/static-css')) {
      report(node, {
        anchor: 'removed-apis',
        message: `"${value}" was removed; this string still names it. theme.css replaces static-css.`,
        rule: 'R3',
      });
    }
  });
};
