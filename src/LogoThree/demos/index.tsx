import { LogoThree, LogoThreeProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: LogoThreeProps | any = useControls(
    {
      size: {
        max: 640,
        min: 24,
        step: 1,
        value: 320,
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <LogoThree style={{ width: '100%' }} {...control} />
    </StroyBook>
  );
};
