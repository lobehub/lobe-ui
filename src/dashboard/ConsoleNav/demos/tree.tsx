import { Button } from '@lobehub/ui/base-ui';
import { ConsoleNav, Surface } from '@lobehub/ui/dashboard';
import { BookOpen, Component } from 'lucide-react';
import { useState } from 'react';

const items = [
  { end: true, href: '/', label: 'Home' },
  { href: '/changelog', label: 'Changelog' },
];

const groups = [
  {
    groups: [
      {
        href: '/sections/components/general',
        items: [
          { end: true, href: '/components/button', label: 'Button' },
          { end: true, href: '/components/icon', label: 'Icon' },
        ],
        key: 'components/general',
        label: 'General',
      },
      {
        href: '/sections/components/layout',
        items: [
          { end: true, href: '/components/flex', label: 'Flex' },
          { end: true, href: '/components/grid', label: 'Grid' },
        ],
        key: 'components/layout',
        label: 'Layout',
      },
    ],
    href: '/sections/components',
    icon: Component,
    key: 'components',
    label: 'Components',
  },
  {
    href: '/sections/guides',
    icon: BookOpen,
    items: [
      { end: true, href: '/guides/start', label: 'Getting started' },
      { end: true, href: '/guides/theme', label: 'Theming' },
    ],
    key: 'guides',
    label: 'Guides',
  },
];

export default () => {
  const [pathname, setPathname] = useState('/components/flex');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ alignItems: 'flex-start', display: 'flex', gap: 16 }}>
      <Surface
        style={{
          blockSize: 360,
          display: 'flex',
          inlineSize: collapsed ? 72 : 260,
          paddingBlock: 8,
        }}
      >
        <ConsoleNav
          collapsed={collapsed}
          defaultExpanded="active"
          groups={groups}
          items={items}
          label="Documentation"
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
