import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { content } from './index';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      variant: {
        options: ['default', 'chat'],
        value: 'chat',
      },
    },
    { store },
  ) as MarkdownProps;

  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
