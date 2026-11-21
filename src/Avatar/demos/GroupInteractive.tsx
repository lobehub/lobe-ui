import { Avatar } from '@lobehub/ui';
import { useState } from 'react';

const people = [
  { color: '#4f7cff', key: 'lin', name: 'Lin Wei' },
  { color: '#e8833a', key: 'sora', name: 'Sora Tanaka', version: '1.2' },
  { color: '#2fa877', key: 'maya', name: 'Maya Chen' },
  { color: '#d9539b', key: 'alex', name: 'Alex Rivera' },
  { color: '#8a63d2', key: 'jun', name: 'Jun Kim' },
];

const badge = (version: string) => (
  <span
    style={{
      background: 'var(--lobe-color-bg-container)',
      borderRadius: 4,
      boxShadow: '0 0 0 1px var(--lobe-color-border)',
      fontSize: 9,
      fontWeight: 600,
      lineHeight: '14px',
      paddingInline: 3,
    }}
  >
    v{version}
  </span>
);

export default () => {
  const [following, setFollowing] = useState<string | null>(null);
  return (
    <Avatar.Group
      max={4}
      shape="circle"
      size={32}
      items={people.map((person) => ({
        avatar: person.name,
        badge: person.version ? badge(person.version) : undefined,
        disabled: !!person.version,
        key: person.key,
        label: person.version
          ? `${person.name} is on v${person.version}`
          : following === person.key
            ? `Stop following ${person.name}`
            : `Follow ${person.name}`,
        pressed: following === person.key,
        ringColor: person.color,
        title: person.name,
      }))}
      onClick={({ key }) => setFollowing((current) => (current === key ? null : key))}
    />
  );
};
