import { Button, type DropdownItem, DropdownMenu, Flexbox, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [rootCount, setRootCount] = useState(0);
  const [submenuCount, setSubmenuCount] = useState(0);

  const items: DropdownItem[] = [
    {
      closeOnClick: false,
      key: 'keep-open',
      label: 'Increment and keep open',
      onClick: () => setRootCount((value) => value + 1),
    },
    {
      children: [
        {
          closeOnClick: false,
          key: 'submenu-keep-open',
          label: 'Increment and keep submenu open',
          onClick: () => setSubmenuCount((value) => value + 1),
        },
        { type: 'divider' },
        {
          key: 'submenu-close',
          label: 'Close from submenu',
        },
      ],
      key: 'submenu',
      label: 'Submenu behavior',
    },
    { type: 'divider' },
    {
      key: 'close',
      label: 'Close menu',
    },
  ];

  return (
    <Flexbox align="center" gap={8}>
      <Flexbox align="center" gap={2}>
        <Text type="secondary">Root keep-open clicks: {rootCount}</Text>
        <Text type="secondary">Submenu keep-open clicks: {submenuCount}</Text>
      </Flexbox>
      <DropdownMenu nativeButton items={items}>
        <Button>Open menu</Button>
      </DropdownMenu>
    </Flexbox>
  );
};
