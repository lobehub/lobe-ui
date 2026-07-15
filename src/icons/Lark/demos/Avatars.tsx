import { Lark } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Lark.Avatar size={64} />
    <Lark.Avatar shape={'square'} size={64} />
  </Flexbox>
);
