import { type ActionIconProps, Avatar } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      animation: false,
      avatar: '😀',
      background: '#FEE064',
      bordered: false,
      loading: false,
      shadow: false,
      shape: {
        options: ['circle', 'square'],
        value: 'circle',
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
  );

  return (
    <StoryBook levaStore={store}>
      <Avatar {...control} />
    </StoryBook>
  );
};
