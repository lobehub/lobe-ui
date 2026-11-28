import { ButtonGroup } from '@lobehub/ui';

// Sample data from the A2UI playground `ButtonGroup` (CopilotKit a2ui-playground, MIT).
export default () => (
  <ButtonGroup
    defaultValue="yearly"
    label="Billing period"
    variant="a2ui"
    options={[
      { label: 'Monthly', value: 'monthly' },
      { label: 'Quarterly', value: 'quarterly' },
      { label: 'Yearly', value: 'yearly' },
    ]}
  />
);
