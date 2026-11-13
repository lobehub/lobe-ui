import { ActionIcon, Avatar, type ListItemType, Text } from '@lobehub/ui';
import { ChevronDown, Home, SquareDashedBottom, Users } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox } from '@/Flex';

import { DemoNavList } from './NavList';

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
        justify={expand ? 'flex-start' : 'center'}
        paddingBlock={8}
        paddingInline={expand ? 12 : 6}
      >
        <Avatar
          avatar={'https://avatars.githubusercontent.com/u/17870709?v=4'}
          shape="square"
          size={expand ? 36 : 32}
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
      <DemoNavList
        activeKey={activeKey}
        expand={expand}
        items={mainItems}
        style={{ marginBlockEnd: 8 }}
        onClick={({ key }) => onSelect(String(key))}
      />
    </Flexbox>
  );
};
