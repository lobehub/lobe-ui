import { Flexbox, Tag, Tooltip } from '@lobehub/ui';

// Sample data from the A2UI standard `Tooltip` (CopilotKit Gen UI, MIT).
export default () => (
  <Flexbox horizontal align="center" gap={8}>
    <span>Audit log</span>
    <Tooltip title="Available to every workspace in December." variant="a2ui">
      <Tag color="info" shape="round" size="small" tabIndex={0} variant="a2ui">
        Beta
      </Tag>
    </Tooltip>
  </Flexbox>
);
