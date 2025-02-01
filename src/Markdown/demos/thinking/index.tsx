import { Markdown } from '@lobehub/ui';
import { Button } from 'antd';
import { useTheme } from 'antd-style';
import { PropsWithChildren, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { fullThinking, inlineMode, ollama, partialThinking } from './content';
import { normalizeThinkTags, remarkCaptureThink } from './remarkPlugin';

const Think = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  return (
    <div style={{ background: theme.colorBgElevated, padding: 12 }}>
      here is a custom think comp:
      <Markdown>{children as string}</Markdown>
    </div>
  );
};

export default () => {
  const [displayContent, setContent] = useState(fullThinking);
  return (
    <div>
      <Flexbox gap={4} horizontal>
        <Button onClick={() => setContent(fullThinking)}>完整</Button>
        <Button onClick={() => setContent(partialThinking)}>部分</Button>
        <Button onClick={() => setContent(ollama)}>未换行</Button>
        <Button onClick={() => setContent(inlineMode)}>inline</Button>
      </Flexbox>
      <Markdown components={{ think: Think }} remarkPlugins={[remarkCaptureThink]}>
        {normalizeThinkTags(displayContent)}
      </Markdown>
    </div>
  );
};
