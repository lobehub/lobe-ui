import { namedImports } from '../../ast';
import type { Rule } from '../../report';
import changed from '../../transforms/v6/data/changed-components.json';

const names = new Set<string>(changed);

export const changedComponents: Rule = ({ ast, options, report }) => {
  for (const { name, specifier } of namedImports(ast, (s) => s === '@lobehub/ui')) {
    if (!names.has(name) || options.baseUiNames?.has(name)) continue;
    report(specifier, {
      anchor: 'components',
      level: 'info',
      message: `\`${name}\` is now the base-ui implementation; its props changed. Check the component page's "Migrating from antd" section.`,
      rule: 'R5',
    });
  }
};
