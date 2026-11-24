import { Flexbox, GlideHighlight, Icon } from '@lobehub/ui';
import { BookOpenIcon, InboxIcon, SettingsIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

const rows = [
  { icon: InboxIcon, label: 'Inbox' },
  { icon: SparklesIcon, label: 'Agents' },
  { icon: UsersIcon, label: 'Team' },
  { icon: BookOpenIcon, label: 'Knowledge' },
  { icon: SettingsIcon, label: 'Settings' },
];

const row: CSSProperties = {
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  display: 'flex',
  font: 'inherit',
  gap: 10,
  padding: '7px 10px',
  textAlign: 'start',
  width: '100%',
};

export default () => (
  <Flexbox padding={16} style={{ width: 240 }}>
    <GlideHighlight style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {rows.map((item) => (
        <button data-glide-row key={item.label} style={row} type="button">
          <Icon icon={item.icon} size={16} />
          {item.label}
        </button>
      ))}
    </GlideHighlight>
  </Flexbox>
);
