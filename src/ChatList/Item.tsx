import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { FC, ReactNode, memo, useCallback, useMemo, useState } from 'react';

import ChatItem, { type ChatItemProps } from '@/ChatItem';
import { ChatMessage } from '@/types/chatMessage';
import { LLMRoleType } from '@/types/llm';

import ActionsBar, { type ActionsBarProps } from './ActionsBar';

export type OnMessageChange = (id: string, content: string) => void;
export type OnActionClick = (actionKey: string, messageId: string) => void;
export type RenderRole = LLMRoleType | 'default' | string;
export type RenderItem = FC<{ key: string } & ChatMessage & ListItemProps>;
export type RenderMessage = FC<ChatMessage>;
export type RenderMessageExtra = FC<ChatMessage>;
export type RenderErrorMessage = FC<ChatMessage>;
export type RenderAction = FC<ActionsBarProps & ChatMessage>;

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
  renderActions?: {
    [role: RenderRole]: RenderAction;
  };
  /**
   * @description 渲染错误消息的函数
   */
  renderErrorMessages?: {
    [errorType: 'default' | string]: RenderErrorMessage;
  };
  renderItems?: {
    [role: RenderRole]: RenderItem;
  };
  /**
   * @description 渲染消息的函数
   */
  renderMessages?: {
    [role: RenderRole]: RenderMessage;
  };
  /**
   * @description 渲染消息额外内容的函数
   */
  renderMessagesExtra?: {
    [role: RenderRole]: RenderMessageExtra;
  };
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
      history?: string;
    } & {
      [key: string]: string;
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
    renderMessagesExtra,
    showTitle,
    onActionClick,
    onMessageChange,
    type,
    text,
    renderMessages,
    renderErrorMessages,
    renderActions,
    loading,
    groupNav,
    renderItems,
    ...item
  } = props;

  const [editing, setEditing] = useState(false);

  const { message } = App.useApp();

  const RenderItem = useMemo(() => {
    if (!renderItems || !item?.role) return;
    if (renderItems?.[item.role]) return renderItems[item.role];
    if (renderItems?.['default']) return renderItems['default'];
  }, [renderItems, item]);

  const innerRenderMessage = useCallback(
    (content: ReactNode) => {
      if (!renderMessages || !item?.role) return;
      let RenderFunction;
      if (renderMessages?.[item.role]) RenderFunction = renderMessages[item.role];
      if (renderMessages?.['default']) RenderFunction = renderMessages['default'];
      if (!RenderFunction) return;
      return <RenderFunction {...item} content={content as any} />;
    },
    [renderMessages, item],
  );

  const MessageExtra = useCallback(() => {
    if (!renderMessagesExtra || !item?.role) return;
    let RenderFunction;
    if (renderMessagesExtra?.[item.role]) RenderFunction = renderMessagesExtra[item.role];
    if (renderMessagesExtra?.['default']) RenderFunction = renderMessagesExtra['default'];
    if (!RenderFunction) return;
    return <RenderFunction {...item} />;
  }, [renderMessagesExtra, item]);

  const ErrorMessage = useCallback(() => {
    if (!renderErrorMessages || !item?.error?.type) return;
    let RenderFunction;
    if (renderErrorMessages?.[item.error.type])
      RenderFunction = renderErrorMessages[item.error.type];
    if (renderErrorMessages?.['default']) RenderFunction = renderErrorMessages['default'];
    if (!RenderFunction) return;
    return <RenderFunction {...item} />;
  }, [renderErrorMessages, item.error]);

  const Actions = useCallback(() => {
    if (!renderActions || !item?.role) return;
    let RenderFunction;
    if (renderActions?.[item.role]) RenderFunction = renderActions[item.role];
    if (renderActions?.['default']) RenderFunction = renderActions['default'];
    if (!RenderFunction) RenderFunction = ActionsBar;
    return (
      <RenderFunction
        {...item}
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
        text={text}
      />
    );
  }, [renderActions, item, text, onActionClick]);

  const error = useMemo(() => {
    if (!item.error) return;
    return {
      message: item.error?.message,
    };
  }, [item.error]);

  if (RenderItem) return <RenderItem key={item.id} {...props} />;

  return (
    <ChatItem
      actions={<Actions />}
      avatar={item.meta}
      avatarAddon={groupNav}
      editing={editing}
      error={error}
      errorMessage={<ErrorMessage />}
      loading={loading}
      message={item.content}
      messageExtra={<MessageExtra />}
      onChange={(value) => onMessageChange?.(item.id, value)}
      onEditingChange={setEditing}
      placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
      primary={item.role === 'user'}
      renderMessage={innerRenderMessage}
      showTitle={showTitle}
      text={text}
      time={item.updateAt || item.createAt}
      type={type === 'chat' ? 'block' : 'pure'}
    />
  );
});

export default Item;
