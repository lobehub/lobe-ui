import { List } from '@lobehub/ui';
import { Activity, BookOpen, Building2, History, LifeBuoy, Sprout, Users } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [picked, setPicked] = useState<string>();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <List
        marker="none"
        variant="a2ui"
        items={[
          {
            description: 'For side projects',
            icon: Sprout,
            key: 'starter',
            label: 'Starter',
            value: 'starter',
          },
          {
            description: 'Up to 30 seats',
            icon: Users,
            key: 'team',
            label: 'Team',
            value: 'team',
          },
          {
            description: 'SSO, audit log and SLA',
            icon: Building2,
            key: 'enterprise',
            label: 'Enterprise',
            value: 'enterprise',
          },
        ]}
        onClick={({ key }) => setPicked(String(key))}
      />
      <List
        direction="horizontal"
        marker="none"
        variant="a2ui"
        items={[
          { icon: BookOpen, key: 'docs', label: 'Docs' },
          { icon: History, key: 'changelog', label: 'Changelog' },
          { icon: Activity, key: 'status', label: 'Status' },
          { icon: LifeBuoy, key: 'support', label: 'Support' },
        ]}
      />
      {picked && <span style={{ fontSize: 12, opacity: 0.6 }}>Picked: {picked}</span>}
    </div>
  );
};
