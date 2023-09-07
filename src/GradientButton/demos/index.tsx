import {
  GradientButton,
  GradientButtonProps,
  StroyBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: GradientButtonProps | any = useControls(
    {
      children: 'Get a Demo',
      glow: true,
      size: {
        options: ['large', 'normal', 'small'],
        value: 'large',
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <GradientButton {...control} />
    </StroyBook>
  );
};
