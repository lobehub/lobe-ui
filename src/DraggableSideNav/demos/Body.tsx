import { Avatar, Menu, Text } from '@lobehub/ui';
import { FolderIcon } from 'lucide-react';
import type { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

import { agents } from './data';

export const DemoBody: FC<{
  activeKey: string;
  collapsed: boolean;
  onSelect: (key: string) => void;
}> = ({ activeKey, collapsed, onSelect }) => {
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
    icon: <Avatar avatar={agent.avatar} size={36} />,
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

  // 根据折叠状态决定是否显示分组标题和分隔符
  // @ts-ignore
  const items = collapsed
    ? [...projectItems, ...agentItems]
    : ([
        {
          children: projectItems,
          key: 'projects-group',
          label: 'Repositories',
          type: 'group',
        },
        { key: 'divider-2', style: { marginBlock: 4, opacity: 0 }, type: 'divider' },
        {
          children: agentItems,
          key: 'agents-group',
          label: 'Agents',
          type: 'group',
        },
      ] as any);

  return (
    <Flexbox style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <Menu
        inlineCollapsed={collapsed}
        items={items}
        mode={'inline'}
        onSelect={({ key }) => {
          onSelect(key);
        }}
        selectable
        selectedKeys={[activeKey]}
        variant={'borderless'}
      />
    </Flexbox>
  );
};
