import { Telegram } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Telegram.Avatar size={64} />
    <Telegram.Avatar shape={'square'} size={64} />
  </Flexbox>
);
