import { Avatar, type ListItem, Text } from '@lobehub/ui';
import { FolderIcon } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox } from '@/Flex';

import { agents } from './data';
import { DemoNavList } from './NavList';

export const DemoBody: FC<{
  activeKey: string;
  expand: boolean;
  onSelect: (key: string) => void;
}> = ({ activeKey, expand, onSelect }) => {
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

  const agentItems = agents.map((agent) => ({
    avatar: <Avatar aria-hidden avatar={agent.avatar} size={expand ? 36 : 32} />,
    key: agent.name,
    label: (
      <Flexbox
        flex={1}
        style={{
          overflow: 'hidden',
        }}
      >
        <Text ellipsis>{agent.name}</Text>
        {expand && (
          <Text ellipsis type={'secondary'}>
            {agent.subtitle}
          </Text>
        )}
      </Flexbox>
    ),
  }));

  const items: ListItem[] = [
    ...projectItems,
    { key: 'agents-divider', type: 'divider' },
    ...agentItems,
  ];

  return (
    <Flexbox style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <DemoNavList
        activeKey={activeKey}
        expand={expand}
        items={items}
        onClick={({ key }) => onSelect(String(key))}
      />
    </Flexbox>
  );
};
