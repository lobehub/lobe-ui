import { ActionIcon, Avatar, List, ListItemProps } from '@lobehub/ui';
import { Dropdown, MenuProps } from 'antd';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

const dropdownItems: MenuProps['items'] = [
  {
    children: [
      {
        key: '1-1',
        label: '1st menu item',
      },
      {
        key: '1-2',
        label: '2nd menu item',
      },
    ],
    key: '1',
    label: 'Group title',
    type: 'group',
  },
  {
    children: [
      {
        key: '2-1',
        label: '3rd menu item',
      },
      {
        key: '2-2',
        label: '4th menu item',
      },
    ],
    key: '2',
    label: 'sub menu',
  },
  {
    children: [
      {
        key: '3-1',
        label: '5d menu item',
      },
      {
        key: '3-2',
        label: '6th menu item',
      },
    ],
    disabled: true,
    key: '3',
    label: 'disabled sub menu',
  },
];

const items: ListItemProps[] = [
  {
    actions: (
      <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
        <ActionIcon icon={MoreHorizontalIcon} />
      </Dropdown>
    ),
    avatar: <Avatar avatar={'😊'} />,
    date: Date.now(),
    description: 'Description 1',
    key: '1',
    pin: true,
    showAction: true,
    title: 'Item 1',
  },
  {
    actions: (
      <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
        <ActionIcon icon={MoreHorizontalIcon} />
      </Dropdown>
    ),
    avatar: <Avatar avatar={'😊'} />,
    date: Date.now(),
    description: 'Description 2',
    key: '2',
    title: 'Item 2',
  },
];

export default () => {
  const [active, setActive] = useState(items[0].key);

  return <List activeKey={active} items={items} onClick={({ key }) => setActive(key)} />;
};
