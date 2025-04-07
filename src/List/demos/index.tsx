import { ActionIcon, Avatar, List, ListItemProps } from '@lobehub/ui';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

const items: ListItemProps[] = [
  {
    actions: <ActionIcon icon={MoreHorizontalIcon} />,
    avatar: <Avatar avatar={'😊'} />,
    date: Date.now(),
    description: 'Description 1',
    key: '1',
    pin: true,
    showAction: true,
    title: 'Item 1',
  },
  {
    actions: <ActionIcon icon={MoreHorizontalIcon} />,
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
