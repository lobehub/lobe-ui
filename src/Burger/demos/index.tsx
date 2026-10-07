import { Flexbox } from '@lobehub/ui';
import { Burger, Button, type ListItem } from '@lobehub/ui';
import { BookOpen, Bot, House, MessageSquare } from 'lucide-react';
import { type Key, useState } from 'react';

const items: ListItem[] = [
  { icon: House, key: 'home', label: 'Home' },
  { icon: MessageSquare, key: 'chat', label: 'Chat' },
  { icon: Bot, key: 'agents', label: 'Agents' },
  { type: 'divider' },
  { icon: BookOpen, key: 'docs', label: 'Docs' },
];

export default () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<Key>('chat');

  return (
    <Flexbox horizontal align="center" justify="space-between" padding={16} style={{ height: 64 }}>
      <strong>LobeHub</strong>
      <Burger
        activeKey={active}
        footer={<Button type="primary">Sign in</Button>}
        items={items}
        opened={opened}
        onOpenChange={setOpened}
        onSelect={setActive}
      />
    </Flexbox>
  );
};
