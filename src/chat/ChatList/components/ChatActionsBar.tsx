import { memo } from 'react';

import ActionIconGroup from '@/ActionIconGroup';

import type { ChatActionsBarProps } from '../type';
import { useChatListActionsBar } from './useChatListActionsBar';

const ChatActionsBar = memo<ChatActionsBarProps>(({ text, ref, ...rest }) => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar(text);
  return (
    <ActionIconGroup
      items={[regenerate, edit]}
      menu={{
        items: [edit, copy, regenerate, divider, del],
      }}
      ref={ref}
      {...rest}
    />
  );
});

export default ChatActionsBar;
