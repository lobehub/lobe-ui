import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Avatar from '@/Avatar';
import { ChatListItemProps } from '@/ChatList/Item';

interface GroupNavProps {
  active: string;
  data: ChatListItemProps[];
  setActive: (id: string) => void;
}

const GroupNav = memo<GroupNavProps>(({ data, active, setActive }) => {
  const theme = useTheme();
  let count = 1;
  return (
    <Flexbox align={'center'} gap={4}>
      {data.map((item) => {
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
      })}
    </Flexbox>
  );
});

export default GroupNav;
