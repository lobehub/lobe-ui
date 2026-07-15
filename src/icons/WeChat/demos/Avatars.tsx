import { WeChat } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <WeChat.Avatar size={64} />
    <WeChat.Avatar shape={'square'} size={64} />
  </Flexbox>
);
