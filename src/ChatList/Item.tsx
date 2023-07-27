import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { ReactNode, memo, useCallback, useState } from 'react';

import ChatItem, { type ChatItemProps } from '@/ChatItem';
import { ChatMessage, ChatMessageError } from '@/types/chatMessage';

import ActionsBar, { type ActionsBarProps } from './ActionsBar';

export type OnMessageChange = (id: string, content: string) => void;
export type MessageExtra = (props: ChatMessage) => ReactNode;
export type OnActionClick = (actionKey: string, messageId: string) => void;
export type RenderMessage = (content: ReactNode, message: ChatMessage) => ReactNode;
export type RenderErrorMessage = (error: ChatMessageError) => ReactNode;

export interface ListItemProps {
  onActionClick?: OnActionClick;
  onMessageChange?: OnMessageChange;
  renderErrorMessage?: RenderErrorMessage;
  renderMessage?: RenderMessage;
  renderMessageExtra?: MessageExtra;
  /**
   * @description Whether to show name of the chat item
   * @default false
   */ showTitle?: boolean;
  text?: ChatItemProps['text'] &
    ActionsBarProps['text'] & {
      copySuccess?: string;
    };
  /**
   * @description Type of chat list
   * @default 'chat'
   */
  type?: 'docs' | 'chat';
}

const Item = memo<ChatMessage & ListItemProps>(
  ({
    renderMessageExtra: MessageExtra,
    showTitle,
    onActionClick,
    onMessageChange,
    type,
    text,
    renderMessage,
    renderErrorMessage,
    ...item
  }) => {
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
        error={
          item.error
            ? {
                description: renderErrorMessage ? renderErrorMessage(item.error) : undefined,
                message: item.error?.message,
              }
            : undefined
        }
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
  },
);

export default Item;
