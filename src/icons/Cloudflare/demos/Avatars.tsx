import { Cloudflare } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Cloudflare.Avatar size={64} />
    <Cloudflare.Avatar shape={'square'} size={64} />
  </Flexbox>
);
