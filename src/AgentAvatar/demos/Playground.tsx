import {
  AGENT_AVATAR_STATES,
  AgentAvatar,
  AgentAvatarPicker,
  type AgentAvatarState,
  type AgentAvatarValue,
  Flexbox,
  Segmented,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState<AgentAvatarValue>({ color: 'geekblue', shape: 'lobot' });
  const [state, setState] = useState<AgentAvatarState>('idle');

  return (
    <Flexbox horizontal align="center" gap={32} justify="center" padding={32} wrap="wrap">
      <Flexbox align="center" flex="1 1 280px" gap={32}>
        <AgentAvatar
          animated
          followPointer
          {...value}
          name={value.shape}
          size={220}
          state={state}
        />
        <Segmented
          size="small"
          value={state}
          variant="filled"
          options={AGENT_AVATAR_STATES.map((item) => ({
            label: item[0].toUpperCase() + item.slice(1),
            value: item,
          }))}
          onChange={setState}
        />
      </Flexbox>
      <Flexbox
        align="center"
        flex="1 1 320px"
        padding={16}
        style={{ border: '1px solid var(--lobe-fill-border)', borderRadius: 16, maxWidth: 360 }}
      >
        <AgentAvatarPicker preview={false} value={value} onChange={setValue} />
      </Flexbox>
    </Flexbox>
  );
};
