import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { github } from './data';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      allowHtml: true,
      children: {
        rows: true,
        value: github,
      },
      fontSize: 16,
      fullFeaturedCodeBlock: true,
      headerMultiple: 1,
      lineHeight: 1.8,
      marginMultiple: 2,
    },
    { store },
  ) as MarkdownProps;

  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
