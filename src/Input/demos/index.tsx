import { Input, InputProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const controls: InputProps | any = useControls(
    {
      placeholder: 'Type keywords...',
      type: {
        value: 'ghost',
        options: ['ghost', 'block'],
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Input {...controls} />
    </StroyBook>
  );
};
