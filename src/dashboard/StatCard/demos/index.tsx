import { StatCard } from '@lobehub/ui/dashboard';
import { Activity } from 'lucide-react';

export default () => {
  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      <StatCard
        prominent
        delta="12%"
        direction="up"
        hint="vs last week"
        label="Requests"
        mark={Activity}
        value="18.4k"
      />
      <StatCard
        delta="3%"
        direction="down"
        hint="error rate"
        label="Failures"
        value="1.2%"
        wash="gray"
      />
      <StatCard direction="flat" hint="no change" label="Queue" value="64" />
    </div>
  );
};
