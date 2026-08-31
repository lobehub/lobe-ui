import { Skeleton } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      animated: {
        label: 'Animation',
        options: ['fade', 'sweep', false],
        value: 'fade',
      },
      height: 32,
      radius: 8,
      width: '100%',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Skeleton {...(control as any)} />
    </StoryBook>
  );
};
