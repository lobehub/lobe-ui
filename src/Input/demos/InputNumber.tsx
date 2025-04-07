import { InputNumber, InputNumberProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const controls: InputNumberProps | any = useControls(
    {
      placeholder: 'Type keywords...',
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <InputNumber {...controls} />
    </StoryBook>
  );
};
