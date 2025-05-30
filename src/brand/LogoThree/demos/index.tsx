import { LogoThree, LogoThreeProps } from '@lobehub/ui/brand';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      size: {
        max: 640,
        min: 24,
        step: 1,
        value: 200,
      },
    },
    { store },
  ) as LogoThreeProps;

  return (
    <StoryBook levaStore={store}>
      <LogoThree {...control} />
    </StoryBook>
  );
};
