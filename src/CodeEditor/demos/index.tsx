import { CodeEditor, type CodeEditorProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { content } from './data';

export default () => {
  const [code, setCode] = useState<string>(content);

  const store = useCreateStore();
  const options = useControls(
    {
      language: 'markdown',
      placeholder: 'Please input your code...',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as CodeEditorProps;

  return (
    <StoryBook levaStore={store}>
      <CodeEditor {...options} language="md" value={code} width={'100%'} onValueChange={setCode} />
    </StoryBook>
  );
};
