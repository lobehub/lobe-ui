import { Avatar, type AvatarProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      animation: false,
      avatar: '😀',
      background: '#FEE064',
      bordered: false,
      loading: false,
      shadow: false,
      shape: {
        options: ['circle', 'square'],
        value: 'square',
      },
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 100,
      },
      title: 'cm',
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  ) as AvatarProps;

  return (
    <StoryBook levaStore={store}>
      <Avatar {...control} />
    </StoryBook>
  );
};
