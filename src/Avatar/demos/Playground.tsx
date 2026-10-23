import { Avatar, type AvatarProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      fallbackVariant: {
        options: ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus', 'text'],
        value: 'marble',
      },
      shape: {
        options: ['square', 'circle'],
        value: 'circle',
      },
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
      title: 'LobeHub',
    },
    { store },
  ) as AvatarProps;

  return (
    <StoryBook levaStore={store}>
      <Avatar {...control} />
    </StoryBook>
  );
};
