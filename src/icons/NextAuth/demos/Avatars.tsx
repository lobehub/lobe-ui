import { NextAuth } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <NextAuth.Avatar size={64} />
    <NextAuth.Avatar shape={'square'} size={64} />
  </Flexbox>
);
