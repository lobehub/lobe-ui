import { Markdown } from '@lobehub/ui';
import { Button } from 'antd';
import { cloneDeep } from 'lodash-es';
import { PropsWithChildren, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { SKIP, visit } from 'unist-util-visit';

import { fullThinking, partialThinking } from './content';

const Think = ({ children }: PropsWithChildren) => {
  console.log(children);
  return (
    <div style={{ background: '#888', padding: 12 }}>
      here is a custom think comp:
      <Markdown>{children as string}</Markdown>
    </div>
  );
};

const remarkCaptureThink = () => {
  return (tree) => {
    let inThink = false;
    let thinkStartIndex = -1;

    console.log('remark:', cloneDeep(tree));
    // 第一遍遍历：定位 <think> 和 </think> 的边界
    visit(tree, 'html', (node, index: number, parent) => {
      if (node.value === '<think>') {
        thinkStartIndex = index as number;
        inThink = true;
        return SKIP; // 停止当前分支的遍历
      }

      if (node.value === '</think>' || inThink) {
        // 收集两个 html 节点之间的所有内容
        const capturedNodes = parent.children.slice(thinkStartIndex + 1, index);

        // 构造自定义节点
        const thinkNode = {
          data: {
            hChildren: [
              {
                type: 'text',
                value: capturedNodes
                  .map((n) => (n.type === 'paragraph' ? n.children[0].value + '\n\n' : n.value))
                  .join('')
                  .trim()
                  .replace(/\n$/, ''),
              },
            ],
            hName: 'think',
          },
          position: {
            end: node.position.end,
            start: parent.children[thinkStartIndex].position.start,
          },
          type: 'thinkBlock',
        };

        // 替换原始节点
        parent.children.splice(thinkStartIndex, index - thinkStartIndex + 1, thinkNode);

        inThink = false;
        return [SKIP, index - (index - thinkStartIndex)]; // 调整遍历位置
      }
    });
  };
};

export default () => {
  const [displayContent, setContent] = useState(fullThinking);
  return (
    <div>
      <Flexbox gap={4} horizontal>
        <Button
          onClick={() => {
            setContent(fullThinking);
          }}
        >
          完整
        </Button>
        <Button
          onClick={() => {
            setContent(partialThinking);
          }}
        >
          部分
        </Button>
      </Flexbox>
      <Markdown components={{ think: Think }} remarkPluginsAhead={[remarkCaptureThink]}>
        {displayContent}
      </Markdown>
    </div>
  );
};
