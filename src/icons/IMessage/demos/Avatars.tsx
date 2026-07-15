import { IMessage } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <IMessage.Avatar size={64} />
    <IMessage.Avatar shape={'square'} size={64} />
  </Flexbox>
);
