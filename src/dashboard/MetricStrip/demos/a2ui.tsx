import { MetricStrip } from '@lobehub/ui/dashboard';

// Sample data from the A2UI playground `StatGroup` (CopilotKit a2ui-playground, MIT).
export default () => (
  <MetricStrip
    variant="a2ui"
    items={[
      { delta: '+8.1%', label: 'Visitors', value: '84,210' },
      { delta: '+14.6%', label: 'Signups', value: 2318 },
      { delta: '-0.3%', direction: 'down', label: 'Conversion', value: '2.75%' },
      { delta: '0.0%', direction: 'flat', label: 'Avg. session', value: '4m 12s' },
    ]}
  />
);
