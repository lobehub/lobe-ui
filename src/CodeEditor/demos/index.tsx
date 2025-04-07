import { CodeEditor, HighlighterProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { content } from '../../Markdown/demos/data';

export default () => {
  const [code, setCode] = useState<string>(content);

  const store = useCreateStore();
  const options: HighlighterProps | any = useControls(
    {
      language: 'markdown',
      placeholder: 'Please input your code...',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <CodeEditor language="md" onValueChange={setCode} value={code} width={'100%'} {...options} />
    </StoryBook>
  );
};
