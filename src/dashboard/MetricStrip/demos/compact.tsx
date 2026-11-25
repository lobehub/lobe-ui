import { MetricStrip } from '@lobehub/ui/dashboard';

const items = [
  { delta: '+10%', direction: 'down' as const, label: 'P95 median', value: '1.01s' },
  { delta: '+42% · 15h', direction: 'down' as const, label: 'P95 peak', value: '2.09s' },
  { delta: '+26%', direction: 'down' as const, label: 'P99 median', value: '19.5s' },
  { delta: '+4%', direction: 'up' as const, label: 'Requests', value: '3.36M' },
];

export default () => (
  <div style={{ maxWidth: 520 }}>
    <MetricStrip columns={items.length} items={items} size="small" />
  </div>
);
