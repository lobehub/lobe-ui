import clsx from 'clsx';
import { type FC } from 'react';

import ActionIconGroup from '@/ActionIconGroup';

import { chatChatActionsBarClasses } from '../stable';
import type { ChatActionsBarProps } from '../type';
import { useChatListActionsBar } from './useChatListActionsBar';

const ChatActionsBar: FC<ChatActionsBarProps> = ({ text, ref, className, ...rest }) => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar(text);
  return (
    <ActionIconGroup
      className={clsx(chatChatActionsBarClasses(), className)}
      items={[regenerate, edit]}
      menu={[edit, copy, regenerate, divider, del]}
      ref={ref}
      {...rest}
    />
  );
};

export default ChatActionsBar;
