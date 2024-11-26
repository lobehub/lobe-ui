import { ActionIcon, Avatar, List, ListItemProps } from '@lobehub/ui';
import { MoreHorizontalIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const { Item } = List;

export default () => {
  const items: ListItemProps[] = [
    {
      actions: <ActionIcon icon={MoreHorizontalIcon} />,
      active: false,
      avatar: <Avatar avatar={'😊'} />,
      date: Date.now(),
      description: 'Description 1',
      pin: true,
      showAction: true,
      title: 'Item 1',
    },
    {
      actions: <ActionIcon icon={MoreHorizontalIcon} />,
      active: false,
      avatar: <Avatar avatar={'😊'} />,
      date: Date.now(),
      description: 'Description 2',
      title: 'Item 2',
    },
  ];

  return (
    <Flexbox>
      {items.map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </Flexbox>
  );
};
