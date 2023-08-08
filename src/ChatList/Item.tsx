import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import ChatItem, { type ChatItemProps } from '@/ChatItem';
import { ChatMessage, ChatMessageError, MessageRoleType } from '@/types/chatMessage';

import ActionsBar, { type ActionsBarProps } from './ActionsBar';

export type OnMessageChange = (id: string, content: string) => void;
export type MessageExtra = (props: ChatMessage) => ReactNode;
export type OnActionClick = (actionKey: string, messageId: string) => void;
export type RenderMessage = (content: ReactNode, message: ChatMessage) => ReactNode;
export type RenderErrorMessage = (error: ChatMessageError, message: ChatMessage) => ReactNode;

export interface ListItemProps {
  groupNav?: ChatItemProps['avatarAddon'];
  loading?: boolean;
  /**
   * @description 点击操作按钮的回调函数
   */
  onActionClick?: OnActionClick;
  /**
   * @description 消息变化的回调函数
   */
  onMessageChange?: OnMessageChange;
  /**
   * @description 渲染错误消息的函数
   */
  renderErrorMessage?: RenderErrorMessage;
  renderItem?: {
    [role: MessageRoleType | string]: (
      data: { key: string } & ChatMessage & ListItemProps,
    ) => ReactNode;
  };
  /**
   * @description 渲染消息的函数
   */
  renderMessage?: RenderMessage;
  /**
   * @description 渲染消息额外内容的函数
   */
  renderMessageExtra?: MessageExtra;
  /**
   * @description 是否显示聊天项的名称
   * @default false
   */
  showTitle?: boolean;
  /**
   * @description 文本内容
   */
  text?: ChatItemProps['text'] &
    ActionsBarProps['text'] & {
      copySuccess?: string;
    };
  /**
   * @description 聊天列表的类型
   * @default 'chat'
   */
  type?: 'docs' | 'chat';
}

export type ChatListItemProps = ChatMessage & ListItemProps;

const Item = memo<ChatListItemProps>((props) => {
  const {
    renderMessageExtra: MessageExtra,
    showTitle,
    onActionClick,
    onMessageChange,
    type,
    text,
    renderMessage,
    renderErrorMessage,
    loading,
    groupNav,
    renderItem,
    ...item
  } = props;

  const renderMessageExtra = MessageExtra ? <MessageExtra {...item} /> : undefined;

  const [editing, setEditing] = useState(false);

  const { message } = App.useApp();

  const innerRenderMessage = useCallback(
    (content: ReactNode) => renderMessage?.(content, item),
    [renderMessage, item],
  );

  const RenderItem = useMemo(
    () => (renderItem && renderItem[item.role] ? renderItem[item.role] : undefined),
    [renderItem],
  );

  if (RenderItem) return <RenderItem key={item.id} {...props} />;

  return (
    <ChatItem
      ErrorMessage={item.error ? renderErrorMessage?.(item.error, item) : undefined}
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
      avatarAddon={groupNav}
      editing={editing}
      error={
        item.error
          ? {
              message: item.error?.message,
            }
          : undefined
      }
      loading={loading}
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
});

export default Item;
