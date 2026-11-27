import { ChipSelect } from '@lobehub/ui';

// Sample data from the A2UI playground `ChipSelect` (CopilotKit a2ui-playground, MIT).
export default () => (
  <ChipSelect
    defaultValue={['deploys', 'incidents']}
    label="Notify me about"
    variant="a2ui"
    options={[
      { label: 'Deploys', value: 'deploys' },
      { label: 'Incidents', value: 'incidents' },
      { label: 'Billing', value: 'billing' },
      { label: 'Security', value: 'security' },
      { label: 'Usage spikes', value: 'usage' },
    ]}
  />
);
