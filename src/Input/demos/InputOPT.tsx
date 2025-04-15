import { InputOPT, InputOPTProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  ) as InputOPTProps;

  return (
    <StoryBook levaStore={store}>
      <InputOPT {...controls} />
    </StoryBook>
  );
};
