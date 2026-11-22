import { AgentAvatarPicker, type AgentAvatarValue, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState<AgentAvatarValue>({ color: 'geekblue', shape: 'magnifier' });

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
      <AgentAvatarPicker value={value} onChange={setValue} />
      <Text code>{JSON.stringify(value)}</Text>
    </div>
  );
};
