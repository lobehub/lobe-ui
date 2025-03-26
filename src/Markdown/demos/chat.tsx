import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { content } from './data';

export default () => {
  const store = useCreateStore();
  const { children, ...rest }: MarkdownProps | any = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      fullFeaturedCodeBlock: true,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Markdown variant={'chat'} {...rest}>
        {children}
      </Markdown>
    </StoryBook>
  );
};
