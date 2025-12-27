import { Button, Markdown } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { PropsWithChildren, useState } from 'react';

import { Flexbox } from '@/Flex';

import { fullThinking, inlineMode, ollama, partialThinking } from './content';
import { normalizeThinkTags, remarkCaptureThink } from './remarkPlugin';

const Think = ({ children }: PropsWithChildren) => {
  return (
    <div style={{ background: cssVar.colorBgElevated, padding: 12 }}>
      here is a custom think comp:
      <Markdown variant={'chat'}>{children as string}</Markdown>
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
      <Markdown components={{ think: Think }} remarkPlugins={[remarkCaptureThink]} variant={'chat'}>
        {normalizeThinkTags(displayContent)}
      </Markdown>
    </div>
  );
};
