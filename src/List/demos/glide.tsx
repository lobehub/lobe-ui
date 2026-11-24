import { Flexbox, List } from '@lobehub/ui';
import { BookOpenIcon, LayoutGridIcon, PencilIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { type Key, useState } from 'react';

export default () => {
  const [active, setActive] = useState<Key>('info');

  return (
    <Flexbox padding={16} style={{ width: 240 }}>
      <List
        glide
        selectable
        activeKey={active}
        items={[
          { icon: UserIcon, key: 'info', label: 'Assistant info' },
          { icon: PencilIcon, key: 'role', label: 'Role' },
          { icon: SettingsIcon, key: 'model', label: 'Model' },
          { icon: LayoutGridIcon, key: 'plugins', label: 'Plugins & skills' },
          { icon: BookOpenIcon, key: 'docs', label: 'Docs' },
        ]}
        onActiveChange={setActive}
      />
    </Flexbox>
  );
};
