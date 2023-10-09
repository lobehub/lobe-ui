import { Input, InputProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const controls: InputProps | any = useControls(
    {
      placeholder: 'Type keywords...',
      type: {
        options: ['ghost', 'block', 'pure'],
        value: 'ghost',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Input {...controls} />
    </StoryBook>
  );
};
