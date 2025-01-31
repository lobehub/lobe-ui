import { Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { markdownElements } from '../MarkdownElements';
import { removeLineBreaksInAntArtifact } from './utils';

const code = `好的,让我来用新的视角解释一下"睡觉"这个词。

<antThinking>这个请求适合创建一个新的SVG卡片artifact。它是一个独立的视觉元素,可以重复使用或修改,符合好的artifact标准。我将创建一个新的artifact,标识符为"sleep-interpretation-card"。</antThinking>

<antArtifact identifier="sleep-interpretation-card" type="image/svg+xml" title="睡觉的新解释">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&amp;display=swap');
    </style>
  </defs>

  <!-- 背景 -->
  <rect width="400" height="600" fill="#F0EAD6"/>

  <!-- 总结 -->
  <text x="200" y="500" font-family="'Noto Serif SC', serif" font-size="20" text-anchor="middle" fill="#8B4513">睡觉：生产力的假死，创造力的重生。</text>
</svg>
</antArtifact>

这是我为"睡觉"这个词创作的新解释卡片。`;

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

export default () => {
  const store = useCreateStore();
  const { enablePlugins, children } = useControls(
    {
      children: {
        rows: true,
        value: code,
      },
      enablePlugins: {
        value: true,
      },
    },
    { store },
  );

  const config = {
    children: removeLineBreaksInAntArtifact(children),
    components: enablePlugins ? components : undefined,
    rehypePlugins: enablePlugins ? rehypePlugins : undefined,
  };

  return (
    <StoryBook levaStore={store}>
      <Markdown {...config} />
    </StoryBook>
  );
};
