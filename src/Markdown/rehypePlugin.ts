// 自定义插件：katex-directive.js
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

// eslint-disable-next-line unicorn/consistent-function-scoping
export const rehypeKatexDir = () => (tree: Node) => {
  visit(tree, 'element', (node: any) => {
    if (node.properties?.className?.includes('katex')) {
      node.properties.dir = 'ltr';
    }
  });
};
