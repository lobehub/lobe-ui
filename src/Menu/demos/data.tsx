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
        key: '3',
        label: 'Navigation Three',
      },
      {
        key: '4',
        label: 'Navigation Four',
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
