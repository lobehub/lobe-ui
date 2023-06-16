import { SearchBar, SearchBarProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const controls: SearchBarProps | any = useControls(
    {
      enableShortKey: true,
      placeholder: 'Type keywords...',
      shortKey: 'f',
      spotlight: false,
      type: {
        options: ['ghost', 'block'],
        value: 'ghost',
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <SearchBar {...controls} />
    </StroyBook>
  );
};
