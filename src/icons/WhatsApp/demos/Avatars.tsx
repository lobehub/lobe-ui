import { WhatsApp } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <WhatsApp.Avatar size={64} />
    <WhatsApp.Avatar shape={'square'} size={64} />
  </Flexbox>
);
