import { LogoThree, LogoThreeProps, StoryBook, useControls, useCreateStore } from '@unitalkai/ui';

export default () => {
  const store = useCreateStore();
  const control: LogoThreeProps | any = useControls(
    {
      size: {
        max: 640,
        min: 24,
        step: 1,
        value: 200,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LogoThree {...control} />
    </StoryBook>
  );
};
