import { FollowUp } from '@lobehub/ui';

// Sample data from the A2UI playground `FollowUp` (CopilotKit standard catalog, MIT).
export default () => (
  <FollowUp
    items={['Compare with last quarter', 'Break down by region', 'Export as CSV']}
    title="Try next"
    variant="a2ui"
  />
);
