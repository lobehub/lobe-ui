import { Snippet, SnippetProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: SnippetProps | any = useControls(
    {
      children: 'pnpm install @lobehub/ui',
      language: 'sh',
      symbol: '$',
      copyable: true,
      type: {
        value: 'ghost',
        options: ['ghost', 'block'],
      },
    },
    { store },
  );
  return (
    <StroyBook levaStore={store}>
      <Snippet {...control} />
    </StroyBook>
  );
};
