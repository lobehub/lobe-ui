import { Icon } from '@lobehub/ui';
import { Badge } from 'antd';
import { Bell, FileText, Folder, Home, MessageCircle, Settings, Star, Users } from 'lucide-react';

// Mock agents data
export const agents = [
  { avatar: '👨‍💼', name: 'LiJian' },
  { avatar: '👩‍💼', name: 'Rene Wang', subtitle: '正在玩 Cursor' },
  { avatar: '🤖', name: 'Carl-bot', subtitle: '正在玩 /games | carl.gg' },
  { avatar: '👔', name: 'Arvin Xu' },
  { avatar: '🎨', name: 'cy948' },
  { avatar: '💻', name: 'Wuxh', subtitle: 'Coding' },
  { avatar: '🎬', name: 'Brandon Studio' },
  { avatar: '🌙', name: 'Tsuki' },
];

// 所有可用的 items
const allItems: any[] = [
  {
    icon: <Icon icon={Home} />,
    key: 'home',
    label: 'Home',
  },
  {
    icon: <Icon icon={FileText} />,
    key: 'documents',
    label: 'Documents',
  },
  {
    children: [
      {
        key: 'project-1',
        label: 'Project 1',
      },
      {
        key: 'project-2',
        label: 'Project 2',
      },
    ],
    icon: <Icon icon={Folder} />,
    key: 'projects',
    label: 'Projects',
  },
  {
    icon: <Icon icon={Star} />,
    key: 'favorites',
    label: 'Favorites',
  },
  {
    type: 'divider',
  },
  {
    icon: <Icon icon={Users} />,
    key: 'team',
    label: 'Team',
  },
  {
    icon: <Icon icon={Settings} />,
    key: 'settings',
    label: 'Settings',
  },
];

// 折叠时只显示部分 items
const collapsedItems: any[] = [
  {
    icon: <Icon icon={Home} />,
    key: 'home',
    label: 'Home',
  },
  {
    icon: <Icon icon={FileText} />,
    key: 'documents',
    label: 'Documents',
  },
  {
    icon: <Icon icon={Folder} />,
    key: 'projects',
    label: 'Projects',
  },
];

// 根据折叠状态返回不同的 items
export const items = (collapsed: boolean) => (collapsed ? collapsedItems : allItems);

// 带自定义渲染的 items（使用徽章）
const collapsedItemsWithBadge: any[] = [
  {
    icon: <Icon icon={Home} />,
    key: 'home',
    label: 'Home',
  },
  {
    icon: <Icon icon={MessageCircle} />,
    key: 'messages',
    label: (
      <Badge count={5} offset={[-4, 0]}>
        Messages
      </Badge>
    ),
  },
  {
    icon: <Icon icon={Bell} />,
    key: 'notifications',
    label: (
      <Badge dot offset={[-4, 0]}>
        Notifications
      </Badge>
    ),
  },
];

const allItemsWithBadge: any[] = [
  {
    icon: <Icon icon={Home} />,
    key: 'home',
    label: 'Home',
  },
  {
    icon: <Icon icon={MessageCircle} />,
    key: 'messages',
    label: (
      <Badge count={5}>
        <span>Messages</span>
      </Badge>
    ),
  },
  {
    icon: <Icon icon={Bell} />,
    key: 'notifications',
    label: (
      <Badge dot>
        <span>Notifications</span>
      </Badge>
    ),
  },
  {
    icon: <Icon icon={Settings} />,
    key: 'settings',
    label: 'Settings',
  },
];

export const itemsWithCustomRender = (collapsed: boolean) =>
  collapsed ? collapsedItemsWithBadge : allItemsWithBadge;
