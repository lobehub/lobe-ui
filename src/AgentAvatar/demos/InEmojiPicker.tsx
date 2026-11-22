import { createAgentAvatarTab, EmojiPicker, parseAgentAvatar, Text } from '@lobehub/ui';
import { useMemo, useState } from 'react';

export default () => {
  const [value, setValue] = useState('agent-avatar:rocket:volcano');
  const customTabs = useMemo(() => [createAgentAvatarTab()], []);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 24,
      }}
    >
      <EmojiPicker customTabs={customTabs} size={64} value={value} onChange={setValue} />
      <Text code>{JSON.stringify(parseAgentAvatar(value) ?? value)}</Text>
    </div>
  );
};
