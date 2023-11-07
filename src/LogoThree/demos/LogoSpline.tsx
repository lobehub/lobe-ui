import { LogoSpline, LogoThreeProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: LogoThreeProps | any = useControls(
    {
      height: {
        max: 640,
        min: 24,
        step: 1,
        value: 400,
      },
      width: {
        max: 640,
        min: 24,
        step: 1,
        value: 640,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LogoSpline {...control} />
    </StoryBook>
  );
};
