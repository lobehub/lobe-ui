import { Avatar, List, type ListItem, type ListItemType, Text } from '@lobehub/ui';
import { FolderIcon } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox } from '@/Flex';

import { agents } from './data';

export const DemoBody: FC<{
  activeKey: string;
  expand: boolean;
  onSelect: (key: string) => void;
}> = ({ activeKey, expand, onSelect }) => {
  // 主导航项

  // 项目相关项
  const projectItems = [
    {
      icon: FolderIcon,
      key: 'new',
      label: 'Repo 1',
    },
    {
      icon: FolderIcon,
      key: 'agent-test',
      label: 'Repo 2',
    },
  ];

  // Agents 项
  const agentItems = agents.map((agent) => ({
    avatar: <Avatar avatar={agent.avatar} size={36} />,
    key: agent.name,
    label: (
      <Flexbox
        flex={1}
        style={{
          overflow: 'hidden',
        }}
      >
        <Text ellipsis>{agent.name}</Text>
        <Text ellipsis type={'secondary'}>
          {agent.subtitle}
        </Text>
      </Flexbox>
    ),
  }));

  const collapse = (item: ListItemType): ListItemType => (expand ? item : { ...item, label: null });
  const items: ListItem[] = [
    ...projectItems.map(collapse),
    { key: 'agents-divider', type: 'divider' },
    ...agentItems.map(collapse),
  ];

  return (
    <Flexbox style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <List activeKey={activeKey} items={items} onClick={({ key }) => onSelect(String(key))} />
    </Flexbox>
  );
};
