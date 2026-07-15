import { MicrosoftTeams } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <MicrosoftTeams.Avatar size={64} />
    <MicrosoftTeams.Avatar shape={'square'} size={64} />
  </Flexbox>
);
