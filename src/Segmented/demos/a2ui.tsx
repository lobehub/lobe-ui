import { Segmented } from '@lobehub/ui';

// Sample data from the A2UI standard `SegmentedControl` (CopilotKit Gen UI 2.0, MIT).
export default () => (
  <Segmented defaultValue="Week" label="Range" options={['Day', 'Week', 'Month']} variant="a2ui" />
);
