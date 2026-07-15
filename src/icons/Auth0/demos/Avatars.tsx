import { Auth0 } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Auth0.Avatar size={64} />
    <Auth0.Avatar shape={'square'} size={64} />
  </Flexbox>
);
