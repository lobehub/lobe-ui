import { visit } from 'unist-util-visit';

interface RemarkColorOptions {
  /**
   * 自定义颜色验证函数
   */
  colorValidator?: (colorString: string) => boolean;
}

/**
 * Remark plugin to handle color syntax in markdown code spans
 * Supports GitHub-style color visualization for HEX, RGB, and HSL colors
 *
 * @example
 * `#FF0000` -> renders with red color preview
 * `rgb(255, 0, 0)` -> renders with red color preview
 * `hsl(0, 100%, 50%)` -> renders with red color preview
 */
export const remarkColor = (options: RemarkColorOptions = {}) => {
  const { colorValidator } = options;

  /**
   * 验证并标准化颜色值
   */
  const validateAndNormalizeColor = (colorString: string): string | null => {
    const trimmed = colorString.trim();

    // 如果有自定义验证函数，使用它
    if (colorValidator && !colorValidator(trimmed)) {
      return null;
    }

    // HEX 颜色: #RRGGBB 或 #RGB
    const hexPattern = /^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/;
    if (hexPattern.test(trimmed)) {
      // 标准化为 6 位 HEX
      if (trimmed.length === 4) {
        const [, r, g, b] = trimmed;
        return `#${r}${r}${g}${g}${b}${b}`;
      }
      return trimmed.toUpperCase();
    }

    // RGB 颜色: rgb(r, g, b)
    const rgbPattern = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
    const rgbMatch = trimmed.match(rgbPattern);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      const rNum = parseInt(r, 10);
      const gNum = parseInt(g, 10);
      const bNum = parseInt(b, 10);

      // 验证 RGB 值范围
      if (rNum >= 0 && rNum <= 255 && gNum >= 0 && gNum <= 255 && bNum >= 0 && bNum <= 255) {
        return `rgb(${rNum}, ${gNum}, ${bNum})`;
      }
    }

    // HSL 颜色: hsl(h, s%, l%)
    const hslPattern = /^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i;
    const hslMatch = trimmed.match(hslPattern);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      const hNum = parseInt(h, 10);
      const sNum = parseInt(s, 10);
      const lNum = parseInt(l, 10);

      // 验证 HSL 值范围
      if (hNum >= 0 && hNum <= 360 && sNum >= 0 && sNum <= 100 && lNum >= 0 && lNum <= 100) {
        return `hsl(${hNum}, ${sNum}%, ${lNum}%)`;
      }
    }

    return null;
  };

  return (tree: any) => {
    // 处理 inlineCode 节点（反引号包围的代码）
    visit(tree, 'inlineCode', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      const colorValue = validateAndNormalizeColor(node.value);

      if (colorValue) {
        // 创建自定义颜色节点
        const colorNode = {
          children: [{ type: 'text', value: node.value }],
          color: colorValue,
          data: {
            hName: 'code',
            hProperties: {
              'className': 'color-preview',
              'data-color': colorValue,
              'data-original': node.value,
              'style': `--color-preview-color: ${colorValue}`,
            },
          },
          type: 'colorPreview',
          value: node.value,
        };

        // 替换 inlineCode 节点
        parent.children.splice(index, 1, colorNode);
        return index;
      }
    });

    // 处理文本节点中的颜色语法（作为备用，处理可能的边缘情况）
    visit(tree, 'text', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      // 查找反引号包围的颜色值
      const colorPattern = /`([^`]+)`/g;
      const text = node.value;

      let hasColorMatch = false;
      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = colorPattern.exec(text)) !== null) {
        const [fullMatch, colorCandidate] = match;
        const colorValue = validateAndNormalizeColor(colorCandidate);

        if (colorValue) {
          hasColorMatch = true;
          const startIndex = match.index;

          // 添加匹配前的文本
          if (startIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: text.slice(lastIndex, startIndex),
            });
          }

          // 添加颜色节点
          newNodes.push({
            children: [{ type: 'text', value: colorCandidate }],
            color: colorValue,
            data: {
              hName: 'code',
              hProperties: {
                'className': 'color-preview',
                'data-color': colorValue,
                'data-original': colorCandidate,
                'style': `--color-preview-color: ${colorValue}`,
              },
            },
            type: 'colorPreview',
            value: colorCandidate,
          });

          lastIndex = startIndex + fullMatch.length;
        }
      }

      if (hasColorMatch) {
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
