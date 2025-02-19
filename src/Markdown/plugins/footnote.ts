import { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

interface FootnoteLink {
  alt?: string;
  title?: string;
  url: string;
}

// eslint-disable-next-line unicorn/consistent-function-scoping
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

// eslint-disable-next-line unicorn/consistent-function-scoping
export const rehypeFootnoteLinks = () => (tree: any, file: any) => {
  const linksData: Record<string, FootnoteLink> = file.data.footnoteLinks || {};

  visit(tree, 'element', (node) => {
    if (node.tagName === 'section' && node.properties.className?.includes('footnotes')) {
      // 转换数据格式为数组（按identifier排序）
      const sortedLinks = Object.entries(linksData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, data]) => ({ id, ...data }));
      // 注入数据属性
      node.properties['data-footnote-links'] = JSON.stringify(sortedLinks);
    }

    if (node.tagName === 'sup') {
      const link = node.children.find((n: any) => n.tagName === 'a');

      if (link) {
        // a node example
        // {
        //     "href": "#user-content-fn-3",
        //     "id": "user-content-fnref-3-2",
        //     "dataFootnoteRef": true,
        // }
        const linkRefIndex = link.properties?.id?.replace(/^user-content-fnref-/, '')[0];

        if (linkRefIndex !== undefined)
          link.properties['data-link'] = JSON.stringify(linksData[linkRefIndex]);
      }
    }
  });
};
