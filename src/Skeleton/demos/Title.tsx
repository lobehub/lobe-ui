import { Skeleton, Text } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Text weight={'bold'}>Title</Text>
    <Skeleton.Title width="60%" />
    <Text fontSize={24} weight={'bold'}>
      Title
    </Text>
    <Skeleton.Title fontSize={24} width="60%" />
  </Flexbox>
);
