'use client';

import { memo } from 'react';

import type { EmojiPickerCustomTab } from '@/EmojiPicker/type';
import agentAvatarMessages from '@/i18n/resources/en/agentAvatar';
import { useTranslation } from '@/i18n/useTranslation';
import Tooltip from '@/Tooltip';

import AgentAvatar from './AgentAvatar';
import AgentAvatarPicker from './AgentAvatarPicker';
import type { CreateAgentAvatarTabOptions } from './type';
import { parseAgentAvatar, stringifyAgentAvatar } from './value';

const TabLabel = memo<{ title?: string }>(({ title }) => {
  const { t } = useTranslation(agentAvatarMessages);
  return (
    <Tooltip title={title ?? t('agentAvatar.tab')}>
      <AgentAvatar color="currentColor" shape="lobot" size={22} tilt={false} />
    </Tooltip>
  );
});

TabLabel.displayName = 'AgentAvatarTabLabel';

/** A custom `EmojiPicker` tab for choosing an AgentAvatar. Its values are `agent-avatar:…` strings. */
export const createAgentAvatarTab = ({
  label,
  placement = 'start',
  texts,
  value = 'agent-avatar',
}: CreateAgentAvatarTabOptions = {}): EmojiPickerCustomTab => ({
  label: label ?? <TabLabel title={texts?.tab} />,
  placement,
  render: (handleAvatarChange, avatar) => (
    <AgentAvatarPicker
      defaultValue={parseAgentAvatar(avatar)}
      style={{ width: 300 }}
      texts={texts}
      onChange={(choice) => handleAvatarChange(stringifyAgentAvatar(choice), { keepOpen: true })}
    />
  ),
  renderValue: (avatar, size) => {
    const choice = parseAgentAvatar(avatar);
    return choice ? <AgentAvatar {...choice} size={size} tilt={false} /> : undefined;
  },
  value,
});
