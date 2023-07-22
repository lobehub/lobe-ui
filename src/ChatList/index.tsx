import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { ReactNode, memo, useState } from 'react';

import ChatItem, { ChatItemProps } from '@/ChatItem';
import type { DivProps } from '@/types';
import { ChatMessage } from '@/types/chatMessage';

import ActionsBar from './ActionsBar';
import { useStyles } from './style';

type MessageExtra = (props: ChatMessage) => ReactNode;
export interface ChatListProps extends DivProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  /**
   * @description Callback function triggered when an action is clicked
   * @param {string} actionKey - The key of the action
   * @param {string} messageId - The id of the message
   */
  onActionClick?: (actionKey: string, messageId: string) => void;
  onMessageChange?: (id: string, content: string) => void;
  renderMessageExtra?: MessageExtra;
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

export interface ItemProps extends ChatMessage {
  MessageExtra?: MessageExtra;
  onActionClick?: (actionKey: string, messageId: string) => void;
  onMessageChange?: (id: string, content: string) => void;
  showTitle?: boolean;
  type: 'docs' | 'chat';
}

const Item = ({
  MessageExtra,
  showTitle,
  onActionClick,
  onMessageChange,
  type,
  ...item
}: ItemProps) => {
  const renderMessageExtra = MessageExtra ? <MessageExtra {...item} /> : undefined;

  const [editing, setEditing] = useState(false);

  const { message } = App.useApp();
  return (
    <ChatItem
      actions={
        <ActionsBar
          onActionClick={(actionKey) => {
            switch (actionKey) {
              case 'copy': {
                copy(item.content);
                message.success('复制成功');
                break;
              }
              case 'edit': {
                console.log('editing');
                setEditing(true);
              }
            }
            onActionClick?.(actionKey, item.id);
          }}
          primary={item.role === 'user'}
        />
      }
      avatar={item.meta}
      editing={editing}
      message={item.content}
      messageExtra={renderMessageExtra}
      onChange={(value) => {
        onMessageChange?.(item.id, value);
      }}
      onEditingChange={setEditing}
      placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
      primary={item.role === 'user'}
      showTitle={showTitle}
      time={item.updateAt || item.createAt}
      type={type === 'chat' ? 'block' : 'pure'}
    />
  );
};

const ChatList = memo<ChatListProps>(
  ({
    onActionClick,
    renderMessageExtra: MessageExtra,
    className,
    data,
    type = 'chat',
    showTitle,
    onMessageChange,
    ...props
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...props}>
        {data.map((item) => (
          <Item
            MessageExtra={MessageExtra}
            key={item.id}
            onActionClick={onActionClick}
            onMessageChange={onMessageChange}
            showTitle={showTitle}
            type={type}
            {...item}
          />
        ))}
      </div>
    );
  },
);

export default ChatList;
