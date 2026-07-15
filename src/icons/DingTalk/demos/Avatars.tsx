import { DingTalk } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <DingTalk.Avatar size={64} />
    <DingTalk.Avatar shape={'square'} size={64} />
  </Flexbox>
);
