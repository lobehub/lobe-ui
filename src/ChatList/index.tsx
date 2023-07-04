import { memo } from 'react';

import ChatItem, { ChatItemProps } from '@/ChatItem';
import type { DivProps } from '@/types';
import { ChatMessage } from '@/types/chatMessage';

import ActionsBar from './ActionsBar';
import { useStyles } from './style';

export interface ChatListProps extends DivProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  onActionClick: (actionKey: string, messageId: string) => void;
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

const ChatList = memo<ChatListProps>(
  ({ onActionClick, className, data, type = 'chat', showTitle, ...props }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...props}>
        {data.map((item) => (
          <ChatItem
            actions={
              <ActionsBar
                onActionClick={(actionKey) => onActionClick(actionKey, item.id)}
                primary={item.role === 'user'}
              />
            }
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
  },
);

export default ChatList;
