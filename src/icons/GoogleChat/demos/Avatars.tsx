import { GoogleChat } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <GoogleChat.Avatar size={64} />
    <GoogleChat.Avatar shape={'square'} size={64} />
  </Flexbox>
);
