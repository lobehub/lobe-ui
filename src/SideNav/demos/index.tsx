import { ActionIcon, Logo, SideNav } from '@unitalkai/ui';
import { Album, MessageSquare, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [tab, setTab] = useState<string>('chat');

  return (
    <SideNav
      avatar={<Logo size={40} />}
      bottomActions={<ActionIcon icon={Settings2} />}
      topActions={
        <>
          <ActionIcon
            active={tab === 'chat'}
            icon={MessageSquare}
            onClick={() => setTab('chat')}
            size="large"
          />
          <ActionIcon
            active={tab === 'market'}
            icon={Album}
            onClick={() => setTab('market')}
            size="large"
          />
        </>
      }
    />
  );
};
