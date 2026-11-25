import { createAgentAvatarTab, EmojiPicker } from '@lobehub/ui';
import { useMemo, useState } from 'react';

export default () => {
  const [value, setValue] = useState('agent-avatar:cat:orange');
  const customTabs = useMemo(() => [createAgentAvatarTab()], []);

  return (
    <EmojiPicker
      allowEmoji={false}
      customTabs={customTabs}
      size={64}
      value={value}
      onChange={setValue}
    />
  );
};
