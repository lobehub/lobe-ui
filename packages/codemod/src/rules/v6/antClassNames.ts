import type { Node } from '@babel/types';

import { walk } from '../../ast';
import type { Rule } from '../../report';

const ANT_PATTERN = /(^|[^\w-])(\.ant-|--ant-)/;

export const antClassNames: Rule = ({ ast, report }) => {
  const check = (node: Node, value: string) => {
    if (!ANT_PATTERN.test(value)) return;
    report(node, {
      anchor: 'behavior-changes',
      message:
        'antd class names and `--ant-*` variables no longer exist. Use `#lobe-ui-theme-app` (`document.getElementById(LOBE_THEME_APP_ID)`) instead of `.ant-app`, `cssVar` / `--lobe-*` instead of `--ant-*`, and the component `className` / `classNames` props instead of `.ant-*` selectors.',
      rule: 'R9',
    });
  };
  walk(ast, (node) => {
    if (node.type === 'StringLiteral') check(node, node.value);
    if (node.type === 'TemplateLiteral') {
      const text = node.quasis.map((q) => q.value.raw).join('');
      check(node, text);
    }
  });
};
