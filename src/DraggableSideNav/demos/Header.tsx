import { ActionIcon, Avatar, Menu, type MenuItemType, Text } from '@lobehub/ui';
import { ChevronDown, Home, SquareDashedBottom, Users } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox } from '@/Flex';

export const DemoHeader: FC<{
  activeKey: string;
  expand: boolean;
  onSelect: (key: string) => void;
}> = ({ activeKey, expand, onSelect }) => {
  const mainItems: MenuItemType[] = [
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
        align={'center'}
        gap={8}
        horizontal
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
      <Menu
        inlineCollapsed={!expand}
        items={mainItems}
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
