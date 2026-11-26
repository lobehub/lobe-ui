import { ComparisonTable } from '@lobehub/ui';

// Sample data from the A2UI playground ComparisonTable (CopilotKit a2ui-playground, MIT).
export default () => (
  <ComparisonTable
    highlight={1}
    options={['Starter', 'Pro', 'Enterprise']}
    title="Pick a plan"
    variant="a2ui"
    rows={[
      { feature: 'Price per seat', values: ['$0', '$24/mo', 'Custom'] },
      { feature: 'Projects', values: [3, 'Unlimited', 'Unlimited'] },
      { feature: 'SSO and SAML', values: [false, true, true] },
      { feature: 'Audit log', values: [false, true, true] },
      { feature: 'Dedicated support', values: [false, false, true] },
      { feature: 'Uptime SLA', values: ['', '99.9%', '99.99%'] },
    ]}
  />
);
