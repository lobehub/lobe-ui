import { Discord } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Discord.Avatar size={64} />
    <Discord.Avatar shape={'square'} size={64} />
  </Flexbox>
);
