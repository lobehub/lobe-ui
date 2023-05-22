import { ActionIcon, Logo, SideNav } from '@lobehub/ui';
import { Album, MessageSquare, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [tab, setTab] = useState<string>('chat');
  return (
    <SideNav
      avatar={<Logo size={40} />}
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
