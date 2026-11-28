import { Select } from '@lobehub/ui';

// Sample data from the A2UI standard `Select` (CopilotKit Gen UI 2.0, MIT).
export default () => (
  <Select
    defaultValue="eu"
    label="Region"
    variant="a2ui"
    options={[
      { label: 'United States', value: 'us' },
      { label: 'Europe', value: 'eu' },
      { label: 'Asia Pacific', value: 'apac' },
    ]}
  />
);
