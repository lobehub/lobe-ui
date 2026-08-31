import { Avatar, Skeleton } from '@lobehub/ui/base-ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal align={'flex-end'} gap={16}>
    <Avatar avatar="https://avatars.githubusercontent.com/u/17870709?v=4" size={40} />
    <Skeleton.Avatar shape={'circle'} size={40} />
    <Avatar
      avatar="https://avatars.githubusercontent.com/u/17870709?v=4"
      shape="square"
      size={64}
    />
    <Skeleton.Avatar size={64} />
  </Flexbox>
);
