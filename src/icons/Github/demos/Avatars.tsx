import { Github } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Github.Avatar size={64} />
    <Github.Avatar shape={'square'} size={64} />
  </Flexbox>
);
