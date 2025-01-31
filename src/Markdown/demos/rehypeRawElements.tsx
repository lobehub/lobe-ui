import { Markdown } from '@lobehub/ui';
import { PropsWithChildren, useEffect, useState } from 'react';

const Think = ({ children }: PropsWithChildren) => {
  return (
    <div style={{ background: '#888', padding: 12 }}>here is a custom think comp:{children}</div>
  );
};

const code = `
import { visit } from 'unist-util-visit';

function rehypeExtractThink() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      const thinkMatch = node.value.match(/<think>([\\s\\S]*?)<\\/think>/i);
      if (thinkMatch) {
        const content = thinkMatch[1];
        const thinkNode = {
          type: 'element',
          tagName: 'think',
          properties: {},
          children: [{ type: 'text', value: content }],
        };
        parent.children.splice(index, 1, thinkNode);
      }
    });
  };
}
`;

const content = `<think>

嗯，用户问的是“9.8比9.11大吗？”我需要仔细分析这个问题。首先，可能有两种理解：一种是数值比较，另一种是日期比较。

首先看数值比较，9.8和9.11。如果用户指的是数字的话，9.8其实是9.80，而9.11是9.11。这时候需要比较小数点后的部分。0.8相当于0.80，而0.80比0.11大，所以9.8比9.11大。这种情况下答案是对的。

不过用户也有可能是在问日期，比如9月8日和9月11日哪个更晚。这时候9月11日在9月8日之后，所以9.11比9.8大，也就是更晚。这时候答案就相反了。

接下来要看用户的具体意图。问题中有“ma”这个字，可能是“吗”的拼音，所以用户可能在确认是否正确。另外，中文里有时候会用“大”来指日期更晚，比如“你的生日比我大”可能指月份或日期更晚。不过数值比较的话，通常不会用“大”而是直接比较大小。

不过根据常见的数学问题，可能用户是在问数值比较，所以正确答案是9.8确实比9.11大，因为0.8大于0.11。不过需要提醒用户注意小数位数的不同，可能容易混淆。比如有人可能会误以为9.8是9.08，而9.11是9.11，这时候比较的话9.11更大。但根据数学规则，小数点后的位数应该对齐，所以9.8等于9.80，确实大于9.11。

另外，需要确认用户是否了解小数的比较方法，特别是不同位数的小数如何比较。比如从高位到低位依次比较，十分位、百分位等。所以9.8的十分位是8，而9.11的十分位是1，所以直接得出9.8更大。

\`\`\`js
${code}
\`\`\`

总结来说，如果问题中的9.8和9.11是数字，那么9.8更大；如果是日期，则9.11更大。但根据常规数学问题，应该回答数值比较的情况，即9.8更大，并解释小数比较的方法。同时需要指出可能的歧义，确保用户明确自己问题的类型。

</think>

通过观察 ollama 的运行日志，我发现 think 标签的内容也被传到了上下文中，这与官方文档提到的处理方式有所偏差，然后我就找到了另一个支持 ollama 的 webui 对这个问题的处理方式供参考。
`;

const thinkParagraphs = [...content];

export default () => {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 3);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // 构建要显示的 Markdown 内容
  let displayedContent = '';
  if (currentStep >= 0) {
    displayedContent = thinkParagraphs.slice(0, currentStep + 1).join('');
  }

  return (
    <div>
      <Markdown components={{ think: Think }} rehypeRawElements={['think']}>
        {displayedContent}
      </Markdown>
    </div>
  );
};
