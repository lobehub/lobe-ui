import { LoadingDots, LoadingDotsProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      color: {
        value: '#1677ff',
      },
      size: {
        max: 20,
        min: 4,
        step: 1,
        value: 8,
      },
      variant: {
        options: ['dots', 'pulse', 'wave', 'orbit', 'typing'],
        value: 'dots',
      },
    },
    { store },
  ) as LoadingDotsProps;

  return (
    <StoryBook levaStore={store}>
      <LoadingDots {...control} />
    </StoryBook>
  );
};
