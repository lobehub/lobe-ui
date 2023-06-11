import { memo } from 'react';

import { ChatMessage } from '@/Chat';
import { ChatItem } from '@/index';
import type { DivProps } from '@/types';

import { useStyles } from './style';

export interface ChatListProps extends DivProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  /**
   * @description Type of chat list
   * @default 'chat'
   */
  type?: 'docs' | 'chat';
}

const ChatList = memo<ChatListProps>(({ className, data, type = 'chat', ...props }) => {
  const { cx, styles } = useStyles();

  return (
    <div className={cx(styles.container, className)} {...props}>
      {data.map((item, index) => (
        <ChatItem
          borderSpacing={type === 'chat'}
          key={index}
          message={item.content}
          placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
          primary={item.role === 'user'}
          type={type === 'chat' ? 'block' : 'pure'}
        />
      ))}
    </div>
  );
});

export default ChatList;
