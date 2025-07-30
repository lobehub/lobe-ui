import { GroupAvatar, type GroupAvatarProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      avatarShape: {
        options: ['circle', 'square'],
        value: 'circle',
      },
      clickable: false,
      cornerShape: {
        options: ['circle', 'square', 'squircle', 'ios', 'smooth', 'sharp'],
        value: 'squircle',
      },
      grid: {
        options: [2, 3, 'auto'],
        value: 2,
      },
      size: {
        max: 128,
        min: 24,
        step: 1,
        value: 100,
      },
    },
    { store },
  ) as GroupAvatarProps;

  return (
    <StoryBook gap={16} levaStore={store}>
      <Flexbox gap={16} horizontal wrap={'wrap'}>
        <GroupAvatar
          avatars={[
            'https://avatars.githubusercontent.com/u/17870709?v=4',
            'https://avatars.githubusercontent.com/u/52880665?v=4',
          ]}
          {...control}
        />
        <GroupAvatar
          avatars={[
            'https://avatars.githubusercontent.com/u/17870709?v=4',
            'https://avatars.githubusercontent.com/u/52880665?v=4',
            '😀',
          ]}
          {...control}
        />
        <GroupAvatar
          avatars={[
            'https://avatars.githubusercontent.com/u/17870709?v=4',
            'https://avatars.githubusercontent.com/u/52880665?v=4',
            {
              avatar: '😀',
              background: '#24FFE2',
            },
            {
              avatar: '🦊',
              background: '#FF57B3',
            },
            'https://avatar.vercel.sh/jane',
            'https://avatar.vercel.sh/john',
            'https://avatar.vercel.sh/alice',
            'https://avatar.vercel.sh/bob',
          ]}
          {...control}
        />
      </Flexbox>
    </StoryBook>
  );
};
