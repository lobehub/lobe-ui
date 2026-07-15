import { Zitadel } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Zitadel.Avatar size={64} />
    <Zitadel.Avatar shape={'square'} size={64} />
  </Flexbox>
);
