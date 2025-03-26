import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { content } from './data';

export default () => {
  const store = useCreateStore();
  const { children, variant }: MarkdownProps | any = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      variant: {
        options: ['normal', 'chat'],
        value: 'chat',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Markdown variant={variant}>{children}</Markdown>
    </StoryBook>
  );
};
