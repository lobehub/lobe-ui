import { Flexbox, Skeleton } from '@lobehub/ui';

// The three placeholders of the A2UI playground `Skeleton` (CopilotKit a2ui-playground, MIT).
export default () => (
  <Flexbox gap={16} style={{ width: '100%' }}>
    <Skeleton lines={3} type="text" variant="a2ui" />
    <Skeleton type="card" variant="a2ui" />
    <Skeleton type="chart" variant="a2ui" />
  </Flexbox>
);
