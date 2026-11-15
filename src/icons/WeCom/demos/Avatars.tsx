import { WeCom } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <WeCom.Avatar size={64} />
    <WeCom.Avatar shape={'square'} size={64} />
  </Flexbox>
);
