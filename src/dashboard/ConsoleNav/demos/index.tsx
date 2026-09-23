import { Button } from '@lobehub/ui/base-ui';
import { ConsoleNav, Surface } from '@lobehub/ui/dashboard';
import { Box, Gauge, Settings, Users } from 'lucide-react';
import { useState } from 'react';

const groups = [
  {
    key: 'operate',
    label: 'Operate',
    items: [
      { href: '/runs', icon: Gauge, label: 'Runs' },
      { href: '/resources', icon: Box, label: 'Resources', badge: 3 },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    items: [
      { href: '/members', icon: Users, label: 'Members' },
      { href: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default () => {
  const [pathname, setPathname] = useState('/runs');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <Surface style={{ inlineSize: collapsed ? 72 : 240, paddingBlock: 8 }}>
        <ConsoleNav
          collapsed={collapsed}
          groups={groups}
          pathname={pathname}
          onNavigate={setPathname}
        />
      </Surface>
      <Button onClick={() => setCollapsed((value) => !value)}>
        {collapsed ? 'Show labels' : 'Icon rail'}
      </Button>
    </div>
  );
};
