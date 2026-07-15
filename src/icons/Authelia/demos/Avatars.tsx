import { Authelia } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Authelia.Avatar size={64} />
    <Authelia.Avatar shape={'square'} size={64} />
  </Flexbox>
);
