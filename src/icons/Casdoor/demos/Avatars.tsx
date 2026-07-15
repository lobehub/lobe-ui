import { Casdoor } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Casdoor.Avatar size={64} />
    <Casdoor.Avatar shape={'square'} size={64} />
  </Flexbox>
);
