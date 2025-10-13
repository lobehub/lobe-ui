import { visit } from 'unist-util-visit';

interface RemarkGfmPlusOptions {
  allowHtmlTags?: string[];
}

const DEFAULT_ALLOW_HTML_TAGS = [
  'sub',
  'sup',
  'ins',
  'kbd',
  'b',
  'strong',
  'i',
  'em',
  'mark',
  'del',
  'u',
];

export const remarkGfmPlus = (options: RemarkGfmPlusOptions = {}) => {
  const { allowHtmlTags = DEFAULT_ALLOW_HTML_TAGS } = options;

  return (tree: any) => {
    // 遍历所有父节点，查找分离的HTML标签模式
    visit(tree, (node: any) => {
      if (!node.children || !Array.isArray(node.children)) return;

      const children = node.children;
      let i = 0;

      while (i < children.length) {
        const currentNode = children[i];

        // 查找开始标签
        if (currentNode.type === 'html' && currentNode.value) {
          const tagPattern = `^<(${allowHtmlTags.join('|')})>$`;
          const startTagMatch = currentNode.value.match(new RegExp(tagPattern));

          if (startTagMatch) {
            const tagName = startTagMatch[1];

            // 查找对应的结束标签
            let endIndex = -1;
            const textNodes: any[] = [];

            for (let j = i + 1; j < children.length; j++) {
              const nextNode = children[j];

              if (nextNode.type === 'html' && nextNode.value === `</${tagName}>`) {
                endIndex = j;
                break;
              } else if (nextNode.type === 'text') {
                textNodes.push(nextNode);
              } else {
                // 如果遇到其他类型的节点，停止查找
                break;
              }
            }

            if (endIndex !== -1) {
              // 收集所有文本内容
              const textContent = textNodes.map((node) => node.value).join('');

              // 创建新的自定义节点
              const newNode = {
                children: [{ type: 'text', value: textContent }],
                data: {
                  hName: tagName,
                  hProperties: {},
                },
                type: tagName,
              };

              // 替换从开始标签到结束标签的所有节点
              const removeCount = endIndex - i + 1;
              children.splice(i, removeCount, newNode);

              // 继续处理下一个节点
              i++;
              continue;
            }
          }
        }

        i++;
      }
    });

    // 保留对文本节点中完整HTML标签的处理（作为备用）
    visit(tree, 'text', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      // 处理HTML实体编码的标签
      const encodedTagPattern = `&lt;(${allowHtmlTags.join('|')})&gt;(.*?)&lt;\\/\\1&gt;`;
      const encodedTagRegex = new RegExp(encodedTagPattern, 'gi');
      const text = node.value;

      if (!encodedTagRegex.test(text)) return;

      // 重置正则表达式的 lastIndex
      encodedTagRegex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = encodedTagRegex.exec(text)) !== null) {
        const [fullMatch, tagName, content] = match;
        const startIndex = match.index;

        // 添加匹配前的文本
        if (startIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, startIndex),
          });
        }

        // 添加特殊标签节点
        newNodes.push({
          children: [{ type: 'text', value: content }],
          data: {
            hName: tagName,
            hProperties: {},
          },
          type: tagName,
        });

        lastIndex = startIndex + fullMatch.length;
      }

      // 添加剩余文本
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // 替换当前节点
      if (newNodes.length > 0 && parent) {
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length - 1;
      }
    });
  };
};
