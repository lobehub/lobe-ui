import { useTheme } from 'antd-style';
import { memo, useCallback, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import Avatar from '@/Avatar';

import Item, { ChatListItemProps } from './Item';

interface ChatListGroup {
  data: ChatListItemProps[];
  meta: ChatListItemProps['meta'];
}

const Group = memo<ChatListGroup>(({ data, meta }) => {
  const [active, setActive] = useState(data[0].id);
  const theme = useTheme();
  const chatItem = useMemo(
    () => data.find((item) => item.id === active) || data[0],
    [data, active],
  );

  const Nav = useCallback(() => {
    let count = 1;
    return data.map((item) => {
      let avatar: string | undefined;
      const isAvtive = active === item.id;
      const metaAvatar = item?.meta?.avatar;
      switch (item.role) {
        case 'assistant': {
          avatar = String(count);
          break;
        }
        case 'function': {
          avatar = metaAvatar || '🧩';
          break;
        }
        case 'system': {
          avatar = metaAvatar || '🚨';
          break;
        }
        default: {
          avatar = metaAvatar || String(count);
          break;
        }
      }
      count++;
      return (
        <Avatar
          avatar={avatar}
          background={isAvtive ? theme.colorPrimary : theme.colorBgElevated}
          key={item.id}
          onClick={() => setActive(item.id)}
          size={20}
        />
      );
    });
  }, [active, data]);

  return (
    <Item
      groupNav={
        <Flexbox align={'center'} gap={4}>
          <Nav />
        </Flexbox>
      }
      {...chatItem}
      meta={meta}
    />
  );
});
export default Group;
