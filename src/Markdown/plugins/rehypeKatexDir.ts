import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

// katex-directive
// 给 class="katex" 的节点加上 dir="ltr" 属性

export const rehypeKatexDir = () => (tree: Node) => {
  visit(tree, 'element', (node: any) => {
    if (node.properties?.className?.includes('katex')) {
      node.properties.dir = 'ltr';
    }
  });
};
