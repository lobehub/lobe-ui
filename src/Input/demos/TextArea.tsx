import { StroyBook, TextArea, TextAreaProps, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const controls: TextAreaProps | any = useControls(
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
      <TextArea {...controls} />
    </StroyBook>
  );
};
