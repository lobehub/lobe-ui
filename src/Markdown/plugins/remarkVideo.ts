import { visit } from 'unist-util-visit';

interface RemarkVideoOptions {
  /**
   * 支持的视频标签名，默认为 ['video']
   */
  videoTags?: string[];
}

/**
 * Remark plugin to handle <video> tags in markdown text
 * This plugin converts <video> tags to proper video elements
 * without requiring allowHtml to be enabled
 *
 * @example
 * <video src="https://example.com/video.mp4" />
 * <video src="https://example.com/video.mp4" controls width="400" height="300" />
 */
export const remarkVideo = (options: RemarkVideoOptions = {}) => {
  const { videoTags = ['video'] } = options;

  return (tree: any) => {
    // 处理HTML节点中的video标签
    visit(tree, 'html', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      for (const tagName of videoTags) {
        // 匹配自闭合的video标签，支持属性
        const selfClosingPattern = `^<${tagName}([^>]*?)\\s*\\/?\\s*>$`;
        const selfClosingMatch = node.value.trim().match(new RegExp(selfClosingPattern, 'i'));

        if (selfClosingMatch) {
          const attributesStr = selfClosingMatch[1]?.trim() || '';

          // 解析属性
          const properties: Record<string, string> = {};
          const attrRegex = /(\w+)=["']([^"']*?)["']/g;
          let attrMatch;

          while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            properties[attrMatch[1]] = attrMatch[2];
          }

          console.log('remarkVideo: Found video tag:', tagName, properties);

          // 创建video节点
          const newNode = {
            children: [],
            data: {
              hName: tagName,
              hProperties: properties,
            },
            type: tagName,
          };

          // 替换html节点为video节点
          parent.children.splice(index, 1, newNode);
          return index;
        }

        // 匹配成对的video标签（虽然不太常见，但也支持）
        const pairedPattern = `^<${tagName}([^>]*?)>(.*?)<\\/${tagName}>$`;
        const pairedMatch = node.value.trim().match(new RegExp(pairedPattern, 'is'));

        if (pairedMatch) {
          const attributesStr = pairedMatch[1]?.trim() || '';
          const content = pairedMatch[2] || '';

          // 解析属性
          const properties: Record<string, string> = {};
          const attrRegex = /(\w+)=["']([^"']*?)["']/g;
          let attrMatch;

          while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            properties[attrMatch[1]] = attrMatch[2];
          }

          console.log('remarkVideo: Found paired video tag:', tagName, properties);

          // 创建video节点
          const newNode = {
            children: content ? [{ type: 'text', value: content }] : [],
            data: {
              hName: tagName,
              hProperties: properties,
            },
            type: tagName,
          };

          // 替换html节点为video节点
          parent.children.splice(index, 1, newNode);
          return index;
        }
      }
    });

    // 处理文本节点中的video标签（HTML实体编码形式）
    visit(tree, 'text', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      for (const tagName of videoTags) {
        // 处理HTML实体编码的自闭合video标签
        const encodedSelfClosingPattern = `&lt;${tagName}([^&]*?)\\s*\\/?\\s*&gt;`;
        const encodedSelfClosingRegex = new RegExp(encodedSelfClosingPattern, 'gi');

        if (!encodedSelfClosingRegex.test(node.value)) continue;

        // 重置正则表达式的 lastIndex
        encodedSelfClosingRegex.lastIndex = 0;

        const text = node.value;
        const newNodes = [];
        let lastIndex = 0;
        let match;

        while ((match = encodedSelfClosingRegex.exec(text)) !== null) {
          const [fullMatch, attributesStr] = match;
          const startIndex = match.index;

          // 添加匹配前的文本
          if (startIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: text.slice(lastIndex, startIndex),
            });
          }

          // 解析属性（需要解码HTML实体）
          const decodedAttrs = attributesStr
            .replaceAll('&quot;', '"')
            .replaceAll('&#39;', "'")
            .replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>');

          const properties: Record<string, string> = {};
          const attrRegex = /(\w+)=["']([^"']*?)["']/g;
          let attrMatch;

          while ((attrMatch = attrRegex.exec(decodedAttrs)) !== null) {
            properties[attrMatch[1]] = attrMatch[2];
          }

          console.log('remarkVideo: Found encoded video tag:', tagName, properties);

          // 添加video节点
          newNodes.push({
            children: [],
            data: {
              hName: tagName,
              hProperties: properties,
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
      }
    });
  };
};
