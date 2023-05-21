import { ActionIcon, SideNav } from '@lobehub/ui';
import { Avatar } from 'antd';
import { Album, MessageSquare, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [tab, setTab] = useState<string>('chat');
  return (
    <SideNav
      avatar={
        <Avatar
          size={40}
          src="https://raw.githubusercontent.com/lobehub/.github/main/profile/Logo.webp"
        />
      }
      topActions={
        <>
          <ActionIcon
            icon={MessageSquare}
            size="large"
            active={tab === 'chat'}
            onClick={() => setTab('chat')}
          />
          <ActionIcon
            icon={Album}
            size="large"
            active={tab === 'market'}
            onClick={() => setTab('market')}
          />
        </>
      }
      bottomActions={
        <>
          <ActionIcon icon={Settings2} />
        </>
      }
    />
  );
};
