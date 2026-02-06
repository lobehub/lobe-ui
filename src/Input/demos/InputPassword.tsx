import { InputPassword, type InputPasswordProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      placeholder: 'Type keywords...',
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  ) as InputPasswordProps;

  return (
    <StoryBook levaStore={store}>
      <InputPassword {...controls} />
    </StoryBook>
  );
};
