import { SKIP, visit } from 'unist-util-visit';

function rehypeAntArtifact() {
  return (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && node.children.length > 0) {
        const firstChild = node.children[0];
        if (firstChild.type === 'raw' && firstChild.value.startsWith('<antArtifact')) {
          // 提取 antArtifact 的属性
          const attributes = {};
          const attributeRegex = /(\w+)="([^"]*)"/g;
          let match;
          while ((match = attributeRegex.exec(firstChild.value)) !== null) {
            // @ts-ignore
            attributes[match[1]] = match[2];
          }

          // 创建新的 antArtifact 节点
          const newNode = {
            children: [
              {
                type: 'text',
                value: node.children
                  .slice(1, -1)
                  .map((child: any) => {
                    if (child.type === 'raw') {
                      return child.value;
                    } else if (child.type === 'text') {
                      return child.value;
                    } else if (child.type === 'element' && child.tagName === 'a') {
                      return child.children[0].value;
                    }
                    return '';
                  })
                  .join('')
                  .trim(),
              },
            ],
            properties: attributes,
            tagName: 'antArtifact',
            type: 'element',
          };

          // 替换原来的 p 节点
          parent.children.splice(index, 1, newNode);
          // @ts-ignore
          return [SKIP, index];
        }
      }
    });
  };
}

export default rehypeAntArtifact;
