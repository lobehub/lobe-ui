import { Slack } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal gap={16}>
    <Slack.Avatar size={64} />
    <Slack.Avatar shape={'square'} size={64} />
  </Flexbox>
);
