import {
  GradientButton,
  GradientButtonProps,
  StoryBook,
  useControls,
  useCreateStore,
} from '@unitalkai/ui';

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
    <StoryBook levaStore={store}>
      <GradientButton {...control} />
    </StoryBook>
  );
};
