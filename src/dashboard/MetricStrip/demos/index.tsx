import { MetricStrip } from '@lobehub/ui/dashboard';

export default () => (
  <MetricStrip
    items={[
      {
        delta: '+12.4%',
        direction: 'up',
        hint: 'vs last week',
        label: 'Active users',
        value: '18,204',
      },
      { delta: '-3.1%', direction: 'down', label: 'Requests', value: '1.2M' },
      { href: '#errors', label: 'Errors', value: 37, valueTone: 'danger' },
      { label: 'Pending reviews', loading: true, value: 0 },
    ]}
  />
);
