import { Logo, LogoProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: LogoProps | any = useControls(
    {
      extra: 'UI',
      size: {
        max: 240,
        min: 16,
        step: 4,
        value: 64,
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Logo type="combine" {...control} />
    </StroyBook>
  );
};
