import { namedImports } from '../../ast';
import type { Rule } from '../../report';

const SOURCES = new Set(['antd-style', '@ant-design/cssinjs']);

export const styleProvider: Rule = ({ ast, report }) => {
  for (const { name, specifier } of namedImports(ast, (s) => SOURCES.has(s))) {
    if (name !== 'StyleProvider') continue;
    report(specifier, {
      anchor: 'styling-api',
      message:
        '`StyleProvider` only carried the antd SSR style cache. Delete it and keep its children.',
      rule: 'R2',
    });
  }
};
