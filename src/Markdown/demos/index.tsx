import { Markdown, MarkdownProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

import { content } from './data';

export default () => {
  const store = useCreateStore();
  const options: MarkdownProps | any = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Markdown {...options} />
    </StroyBook>
  );
};
