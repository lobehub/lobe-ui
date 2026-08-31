import { Avatar, Skeleton } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Avatar avatar="https://avatars.githubusercontent.com/u/17870709?v=4" size={40} />
    <Skeleton.Avatar size={40} />
    <Avatar
      avatar="https://avatars.githubusercontent.com/u/17870709?v=4"
      shape="square"
      size={48}
    />
    <Skeleton.Avatar shape="square" size={48} />
    <Avatar avatar="https://avatars.githubusercontent.com/u/17870709?v=4" size={64} />
    <Skeleton.Avatar size={64} />
    <Avatar
      avatar="https://avatars.githubusercontent.com/u/17870709?v=4"
      shape="square"
      size={80}
    />
    <Skeleton.Avatar shape="square" size={80} />
  </Flexbox>
);
