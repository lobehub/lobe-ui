import { StatCard } from '@lobehub/ui/dashboard';
import { Activity } from 'lucide-react';

export default () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
      }}
    >
      <StatCard
        delta="+12%"
        direction="up"
        hint="vs last week"
        label="Requests"
        mark={Activity}
        value="18.4k"
      />
      <StatCard delta="+3%" direction="down" hint="error rate" label="Failures" value="1.2%" />
      <StatCard direction="flat" hint="no change" label="Queue" value="64" />
    </div>
  );
};
