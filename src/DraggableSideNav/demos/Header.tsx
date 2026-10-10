import { ActionIcon, Avatar, List, type ListItemType, Text } from '@lobehub/ui';
import { ChevronDown, Home, SquareDashedBottom, Users } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox } from '@/Flex';

export const DemoHeader: FC<{
  activeKey: string;
  expand: boolean;
  onSelect: (key: string) => void;
}> = ({ activeKey, expand, onSelect }) => {
  const mainItems: ListItemType[] = [
    {
      icon: Home,
      key: 'home',
      label: 'Home',
    },
    {
      icon: SquareDashedBottom,
      key: 'integrations',
      label: 'Integrations',
    },
    {
      icon: Users,
      key: 'community',
      label: 'Community',
    },
  ];

  return (
    <Flexbox>
      <Flexbox
        horizontal
        align={'center'}
        gap={8}
        justify={'flex-start'}
        padding={4}
        style={{
          margin: 4,
        }}
      >
        <Avatar
          avatar={'https://avatars.githubusercontent.com/u/17870709?v=4'}
          shape="square"
          size={36}
        />
        {expand && (
          <>
            <Flexbox
              flex={1}
              style={{
                overflow: 'hidden',
              }}
            >
              <Text ellipsis>Canis workspace</Text>
            </Flexbox>
            <ActionIcon icon={ChevronDown} size="small" />
          </>
        )}
      </Flexbox>
      <List
        activeKey={activeKey}
        items={mainItems.map((item) => (expand ? item : { ...item, label: null }))}
        onClick={({ key }) => onSelect(String(key))}
      />
    </Flexbox>
  );
};
