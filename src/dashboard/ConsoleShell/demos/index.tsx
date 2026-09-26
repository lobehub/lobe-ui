import { Breadcrumb, ConsoleBrand, ConsoleNav, ConsoleShell } from '@lobehub/ui/dashboard';
import { Box, LayoutDashboard, Settings } from 'lucide-react';
import { useState } from 'react';

const groups = [
  {
    key: 'workspace',
    label: 'Workspace',
    items: [
      { href: '/overview', icon: LayoutDashboard, label: 'Overview' },
      { href: '/resources', icon: Box, label: 'Resources', badge: 3 },
    ],
  },
  {
    key: 'system',
    label: 'System',
    items: [{ href: '/settings', icon: Settings, label: 'Settings' }],
  },
];

export default () => {
  const [pathname, setPathname] = useState('/overview');
  return (
    <ConsoleShell
      brand={<ConsoleBrand logo={<LayoutDashboard size={22} />} title="Console" />}
      navigation={<ConsoleNav groups={groups} pathname={pathname} onNavigate={setPathname} />}
      style={{ blockSize: 560 }}
      breadcrumb={
        <Breadcrumb
          items={[
            { href: '/overview', label: 'Workspace', onClick: () => setPathname('/overview') },
            { label: 'Overview' },
          ]}
        />
      }
    >
      <div>Current page: {pathname}</div>
    </ConsoleShell>
  );
};
