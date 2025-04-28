import { BottomGradientButton, type BottomGradientButtonProps } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      children: 'Get a Demo',
      glow: true,
      size: {
        options: ['large', 'normal', 'small'],
        value: 'large',
      },
    },
    { store },
  ) as BottomGradientButtonProps;

  return (
    <StoryBook levaStore={store}>
      <BottomGradientButton {...control} />
    </StoryBook>
  );
};
