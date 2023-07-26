import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { ReactNode, memo, useCallback, useState } from 'react';

import ChatItem, { type ChatItemProps } from '@/ChatItem';
import type { DivProps } from '@/types';
import { ChatMessage } from '@/types/chatMessage';

import ActionsBar, { type ActionsBarProps } from './ActionsBar';
import { useStyles } from './style';

export type MessageExtra = (props: ChatMessage) => ReactNode;

export type RenderMessage = (content: ReactNode, message: ChatMessage) => ReactNode;

export interface ItemProps extends ChatMessage {
  MessageExtra?: MessageExtra;
  onActionClick?: (actionKey: string, messageId: string) => void;
  onMessageChange?: (id: string, content: string) => void;
  renderMessage?: RenderMessage;
  showTitle?: boolean;
  text?: ChatItemProps['text'] &
    ActionsBarProps['text'] & {
      copySuccess?: string;
    };
  type: 'docs' | 'chat';
}

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
  renderMessage?: RenderMessage;
  renderMessageExtra?: MessageExtra;
  /**
   * @description Whether to show name of the chat item
   * @default false
   */
  showTitle?: ChatItemProps['showTitle'];
  text?: ItemProps['text'];
  /**
   * @description Type of chat list
   * @default 'chat'
   */
  type?: 'docs' | 'chat';
}

const Item = ({
  MessageExtra,
  showTitle,
  onActionClick,
  onMessageChange,
  type,
  text,
  renderMessage,
  ...item
}: ItemProps) => {
  const renderMessageExtra = MessageExtra ? <MessageExtra {...item} /> : undefined;

  const [editing, setEditing] = useState(false);

  const { message } = App.useApp();

  const innerRenderMessage = useCallback(
    (content: ReactNode) => renderMessage?.(content, item),
    [renderMessage],
  );

  return (
    <ChatItem
      actions={
        <ActionsBar
          onActionClick={(actionKey) => {
            switch (actionKey) {
              case 'copy': {
                copy(item.content);
                message.success(text?.copySuccess || 'Copy Success');
                break;
              }
              case 'edit': {
                setEditing(true);
                break;
              }
            }
            onActionClick?.(actionKey, item.id);
          }}
          primary={item.role === 'user'}
          text={text}
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
      renderMessage={renderMessage ? innerRenderMessage : undefined}
      showTitle={showTitle}
      text={text}
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
    text,
    showTitle,
    onMessageChange,
    renderMessage,
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
            renderMessage={renderMessage}
            showTitle={showTitle}
            text={text}
            type={type}
            {...item}
          />
        ))}
      </div>
    );
  },
);

export default ChatList;
