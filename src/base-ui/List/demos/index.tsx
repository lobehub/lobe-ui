import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Avatar, List } from '@lobehub/ui/base-ui';
import {
  BookOpenIcon,
  LayoutGridIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { type Key, useState } from 'react';

export default () => {
  const [active, setActive] = useState<Key>('info');

  return (
    <Flexbox horizontal gap={32} padding={16} wrap="wrap">
      <Flexbox style={{ width: 220 }}>
        <List
          selectable
          activeKey={active}
          items={[
            { icon: UserIcon, key: 'info', label: 'Assistant info' },
            { icon: PencilIcon, key: 'role', label: 'Role' },
            { icon: SettingsIcon, key: 'model', label: 'Model' },
            { icon: LayoutGridIcon, key: 'plugins', label: 'Plugins & skills' },
          ]}
          onActiveChange={setActive}
        />
      </Flexbox>
      <Flexbox style={{ width: 220 }}>
        <List
          items={[
            { extra: '⌘ ,', icon: SettingsIcon, key: 'settings', label: 'Settings' },
            { icon: BookOpenIcon, key: 'docs', label: 'Docs' },
            { type: 'divider' },
            { danger: true, icon: LogOutIcon, key: 'logout', label: 'Log out' },
          ]}
        />
      </Flexbox>
      <Flexbox style={{ width: 280 }}>
        <List
          variant="outlined"
          items={[
            {
              actions: <ActionIcon icon={XIcon} size="small" title="Remove" />,
              avatar: <Avatar avatar="✍️" size={28} />,
              description: 'Long-form writing and polishing',
              extra: 'Host',
              key: 'writer',
              label: 'Writer',
            },
            {
              actions: <ActionIcon icon={XIcon} size="small" title="Remove" />,
              avatar: <Avatar avatar="🧑‍💻" size={28} />,
              description: 'Edge cases and performance',
              key: 'reviewer',
              label: 'Code reviewer',
            },
          ]}
        />
      </Flexbox>
    </Flexbox>
  );
};
