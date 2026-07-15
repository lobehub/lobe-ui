import { Logto } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Logto.Avatar size={64} />
    <Logto.Avatar shape={'square'} size={64} />
  </Flexbox>
);
