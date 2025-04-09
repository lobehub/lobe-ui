import { Icon, type ItemType } from '@lobehub/ui';
import { AppleIcon, MailIcon, SettingsIcon } from 'lucide-react';

export const items: ItemType[] = [
  {
    icon: <Icon icon={MailIcon} />,
    key: 'mail',
    label: 'Navigation One',
  },
  {
    icon: <Icon icon={AppleIcon} />,
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
        key: 'group:1',
        label: 'group 1',
        type: 'group',
      },
      {
        children: [
          { key: 'setting:3', label: 'Option 3' },
          { key: 'setting:4', label: 'Option 4' },
        ],
        key: 'group:2',
        label: 'group 2',
        type: 'group',
      },
    ],
    icon: <Icon icon={SettingsIcon} />,
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
        icon: <Icon icon={AppleIcon} />,
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
        icon: <Icon icon={MailIcon} />,
        key: '3',
        label: 'Navigation One',
      },
      {
        icon: <Icon icon={AppleIcon} />,
        key: '4',
        label: 'Navigation Two',
      },
    ],
    key: 'group2',
    label: 'Group 2',
    type: 'group',
  },
];
