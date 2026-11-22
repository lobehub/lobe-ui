import { createAgentAvatarTab, EmojiPicker } from '@lobehub/ui';
import { useMemo, useState } from 'react';

export default () => {
  const [value, setValue] = useState('agent-avatar:lobot:geekblue');
  const customTabs = useMemo(() => [createAgentAvatarTab()], []);

  return <EmojiPicker customTabs={customTabs} size={64} value={value} onChange={setValue} />;
};
