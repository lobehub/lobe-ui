import { Clerk } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Clerk.Avatar size={64} />
    <Clerk.Avatar shape={'square'} size={64} />
  </Flexbox>
);
