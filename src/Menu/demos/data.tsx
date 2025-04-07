import { ItemType } from '@lobehub/ui';
import { AppleIcon, MailIcon, SettingsIcon } from 'lucide-react';

export const items: ItemType[] = [
  {
    icon: MailIcon,
    key: 'mail',
    label: 'Navigation One',
  },
  {
    icon: AppleIcon,
    key: 'app',
    label: 'Navigation Two',
  },
  {
    type: 'divider',
  },
  {
    children: [
      {
        children: [
          { key: 'setting:1', label: 'Option 1' },
          { key: 'setting:2', label: 'Option 2' },
        ],
        label: 'Item 1',
        type: 'group',
      },
      {
        children: [
          { key: 'setting:3', label: 'Option 3' },
          { key: 'setting:4', label: 'Option 4' },
        ],
        label: 'Item 2',
        type: 'group',
      },
    ],
    icon: SettingsIcon,
    key: 'SubMenu',
    label: 'Navigation Three - Submenu',
  },
];

export const groupItems: ItemType[] = [
  {
    children: [
      {
        icon: MailIcon,
        key: '1',
        label: 'Navigation One',
      },
      {
        icon: AppleIcon,
        key: '2',
        label: 'Navigation Two',
      },
    ],
    key: 'group1',
    label: 'Group 1',
    type: 'group',
  },
  {
    children: [
      {
        icon: MailIcon,
        key: '3',
        label: 'Navigation One',
      },
      {
        icon: AppleIcon,
        key: '4',
        label: 'Navigation Two',
      },
    ],
    key: 'group1',
    label: 'Group 2',
    type: 'group',
  },
];
