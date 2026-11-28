import { RadioGroup } from '@lobehub/ui';

// Sample data from the A2UI standard `RadioGroup` (CopilotKit Gen UI 2.0, MIT).
export default () => (
  <RadioGroup
    defaultValue="team"
    horizontal={false}
    label="Plan"
    variant="a2ui"
    options={[
      { label: 'Free', value: 'free' },
      { description: 'Up to 30 seats', label: 'Team', value: 'team' },
      { label: 'Enterprise', value: 'enterprise' },
    ]}
  />
);
