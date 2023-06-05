import { SearchBar, SearchBarProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const controls: SearchBarProps | any = useControls(
    {
      placeholder: 'Type keywords...',
      type: {
        value: 'ghost',
        options: ['ghost', 'block'],
      },
      enableShortKey: true,
      shortKey: 'f',
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <SearchBar {...controls} />
    </StroyBook>
  );
};
