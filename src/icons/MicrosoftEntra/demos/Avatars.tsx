import { MicrosoftEntra } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <MicrosoftEntra.Avatar size={64} />
    <MicrosoftEntra.Avatar shape={'square'} size={64} />
  </Flexbox>
);
