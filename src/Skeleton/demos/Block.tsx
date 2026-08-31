import { Skeleton } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Skeleton.Block height={200} width={200} />
    <Skeleton.Block height={100} width={200} />
    <Skeleton.Block height={400} width={200} />
  </Flexbox>
);
