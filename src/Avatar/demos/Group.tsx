import { type ActionIconProps, Avatar, type AvatarGroupProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const url = 'https://avatars.githubusercontent.com/u/17870709?v=4';

const items: AvatarGroupProps['items'] = Array.from({ length: 10 }, (_, index) => {
  return {
    avatar: url,
    key: String(index),
    title: 'CanisMinor',
  };
});

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      bordered: false,
      max: {
        max: 100,
        min: 0,
        step: 1,
        value: 4,
      },
      shadow: false,
      shape: {
        options: ['circle', 'square'],
        value: 'circle',
      },
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 48,
      },
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'filled',
      },
    },
    { store },
  );
  return (
    <StoryBook levaStore={store}>
      <Avatar.Group items={items} onClick={console.log} {...control} />
    </StoryBook>
  );
};
