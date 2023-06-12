import { memo } from 'react';

import { ChatItem, ChatItemProps } from '@/index';
import type { DivProps } from '@/types';
import { ChatMessage } from '@/types/chatMessage';

import { useStyles } from './style';

export interface ChatListProps extends DivProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  /**
   * @description Whether to show name of the chat item
   * @default false
   */
  showTitle?: ChatItemProps['showTitle'];
  /**
   * @description Type of chat list
   * @default 'chat'
   */
  type?: 'docs' | 'chat';
}

const ChatList = memo<ChatListProps>(({ className, data, type = 'chat', showTitle, ...props }) => {
  const { cx, styles } = useStyles();

  return (
    <div className={cx(styles.container, className)} {...props}>
      {data.map((item) => (
        <ChatItem
          avatar={item.meta}
          borderSpacing={type === 'chat'}
          key={item.id}
          message={item.content}
          placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
          primary={item.role === 'user'}
          showTitle={showTitle}
          time={item.updateAt || item.createAt}
          type={type === 'chat' ? 'block' : 'pure'}
        />
      ))}
    </div>
  );
});

export default ChatList;
