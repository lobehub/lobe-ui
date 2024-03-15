import { Markdown, MarkdownProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

import { code } from './data';

export default () => {
  const store = useCreateStore();
  const options: MarkdownProps | any = useControls(
    {
      allowHtml: true,
      children: {
        rows: true,
        value: code,
      },
      fullFeaturedCodeBlock: true,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
