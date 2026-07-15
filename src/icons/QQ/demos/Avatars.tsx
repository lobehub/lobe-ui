import { QQ } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <QQ.Avatar size={64} />
    <QQ.Avatar shape={'square'} size={64} />
  </Flexbox>
);
