import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

export interface FootnoteLink {
  alt?: string;
  title?: string;
  url: string;
}

export const remarkCustomFootnotes = () => (tree: any, file: any) => {
  const footnoteLinks = new Map();

  visit(tree, 'footnoteDefinition', (node) => {
    let linkData: FootnoteLink | null = null;

    // 查找第一个link类型的子节点
    visit(node, 'link', (linkNode) => {
      if (linkData) return SKIP; // 只取第一个链接

      // 提取链接文本
      const textNode = linkNode.children.find((n: Node) => n.type === 'text');

      linkData = {
        alt: textNode?.value || '',
        title: textNode?.value || '',
        url: linkNode.url, // 或者根据需求处理
      };

      return SKIP; // 找到后停止遍历
    });

    if (linkData) {
      footnoteLinks.set(node.identifier, linkData);
    }
  });

  // 将数据存入文件上下文
  file.data.footnoteLinks = Object.fromEntries(footnoteLinks);
};
