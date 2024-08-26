import { Burger, type BurgerProps } from '@unitalkai/ui';
import { useState } from 'react';

const items: BurgerProps['items'] = [
  {
    key: 'home',
    label: 'Home',
  },
  {
    key: 'about',
    label: 'About',
  },
  {
    children: [
      {
        key: 'group',
        label: 'Group Title',
        type: 'group',
      },
      {
        key: 'item1',
        label: 'Item1',
      },
      {
        key: 'item2',
        label: 'Item2',
      },
    ],
    key: 'contact',
    label: 'Contact',
  },
];

export default () => {
  const [opened, setOpened] = useState(false);
  return <Burger items={items} opened={opened} setOpened={setOpened} />;
};
