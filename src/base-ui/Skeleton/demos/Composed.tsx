import { Skeleton } from '@lobehub/ui/base-ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Skeleton.Avatar shape={'circle'} size={48} />
    <Flexbox gap={12} width={'100%'}>
      <Skeleton.Text fontSize={16} width={'30%'} />
      <Skeleton.Text rows={3} />
      <Skeleton height={120} radius={8} />
    </Flexbox>
  </Flexbox>
);
