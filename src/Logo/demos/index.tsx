import { Logo, LogoProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: LogoProps | any = useControls(
    {
      size: {
        value: 64,
        step: 4,
        min: 16,
        max: 240,
      },
      type: {
        value: '3d',
        options: ['3d', 'flat', 'high-contrast', 'text', 'combine'],
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Logo {...control} />
    </StroyBook>
  );
};
