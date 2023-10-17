import { App } from 'antd';
import copy from 'copy-to-clipboard';
import { FC, ReactNode, memo, useCallback, useMemo, useState } from 'react';

import ChatItem, { type ChatItemProps } from '@/ChatItem';
import { ChatMessage } from '@/types/chatMessage';
import { LLMRoleType } from '@/types/llm';

import ActionsBar, { type ActionsBarProps } from './ActionsBar';

export type OnMessageChange = (id: string, content: string) => void;
export type OnActionClick = (props: ChatMessage) => void;
export type RenderRole = LLMRoleType | 'default' | string;
export type RenderItem = FC<{ key: string } & ChatMessage & ListItemProps>;
export type RenderMessage = FC<ChatMessage & { editableContent: ReactNode }>;
export type RenderMessageExtra = FC<ChatMessage>;
export type RenderErrorMessage = FC<ChatMessage>;
export type RenderAction = FC<ActionsBarProps & ChatMessage>;

export interface ListItemProps {
  groupNav?: ChatItemProps['avatarAddon'];
  loading?: boolean;
  /**
   * @description 点击操作按钮的回调函数
   */
  onActionsClick?: {
    [role: RenderRole]: OnActionClick;
  };
  /**
   * @description 消息变化的回调函数
   */
  onMessageChange?: OnMessageChange;
  renderActions?: {
    [actionKey: string]: RenderAction;
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
    onActionsClick,
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
    let renderFunction;
    if (renderItems?.[item.role]) renderFunction = renderItems[item.role];
    if (!renderFunction && renderItems?.['default']) renderFunction = renderItems['default'];
    if (!renderFunction) return;
    return renderFunction;
  }, [renderItems?.[item.role]]);

  const RenderMessage = useCallback(
    ({ editableContent, data }: { data: ChatMessage, editableContent: ReactNode; }) => {
      if (!renderMessages || !item?.role) return;
      let RenderFunction;
      if (renderMessages?.[item.role]) RenderFunction = renderMessages[item.role];
      if (!RenderFunction && renderMessages?.['default'])
        RenderFunction = renderMessages['default'];
      if (!RenderFunction) return;
      return <RenderFunction {...data} editableContent={editableContent} />;
    },
    [renderMessages?.[item.role]],
  );

  const MessageExtra = useCallback(
    ({ data }: { data: ChatMessage }) => {
      if (!renderMessagesExtra || !item?.role) return;
      let RenderFunction;
      if (renderMessagesExtra?.[item.role]) RenderFunction = renderMessagesExtra[item.role];
      if (renderMessagesExtra?.['default']) RenderFunction = renderMessagesExtra['default'];
      if (!RenderFunction && !RenderFunction) return;
      return <RenderFunction {...data} />;
    },
    [renderMessagesExtra?.[item.role]],
  );

  const ErrorMessage = useCallback(
    ({ data }: { data: ChatMessage }) => {
      if (!renderErrorMessages || !item?.error?.type) return;
      let RenderFunction;
      if (renderErrorMessages?.[item.error.type])
        RenderFunction = renderErrorMessages[item.error.type];
      if (!RenderFunction && renderErrorMessages?.['default'])
        RenderFunction = renderErrorMessages['default'];
      if (!RenderFunction) return;
      return <RenderFunction {...data} />;
    },
    [renderErrorMessages?.[item?.error?.type]],
  );

  const onActionClick = useCallback(
    (actionKey: string, data: ChatMessage) => {
      if (!actionKey) return;
      const handleActionClick: { [role: RenderRole]: OnActionClick } = {
        copy: (data) => {
          copy(data.content);
          message.success(text?.copySuccess || 'Copy Success');
        },
        edit: () => setEditing(true),
        ...onActionsClick,
      };
      return () => handleActionClick?.[actionKey]?.(data);
    },
    [onActionsClick?.[item.role], text],
  );

  const Actions = useCallback(
    ({ data }: { data: ChatMessage }) => {
      if (!renderActions || !item?.role) return;
      let RenderFunction;
      if (renderActions?.[item.role]) RenderFunction = renderActions[item.role];
      if (renderActions?.['default']) RenderFunction = renderActions['default'];
      if (!RenderFunction) RenderFunction = ActionsBar;
      return (
        <RenderFunction
          {...data}
          onActionClick={(actionKey) => onActionClick(actionKey, data)}
          text={text}
        />
      );
    },
    [renderActions?.[item.role], text, onActionClick],
  );

  const error = useMemo(() => {
    if (!item.error) return;
    return {
      message: item.error?.message,
    };
  }, [item.error]);

  if (RenderItem) return <RenderItem key={item.id} {...props} />;

  return (
    <ChatItem
      actions={<Actions data={item} />}
      avatar={item.meta}
      avatarAddon={groupNav}
      editing={editing}
      error={error}
      errorMessage={<ErrorMessage data={item} />}
      loading={loading}
      message={item.content}
      messageExtra={<MessageExtra data={item} />}
      onChange={(value) => onMessageChange?.(item.id, value)}
      onEditingChange={setEditing}
      placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
      primary={item.role === 'user'}
      renderMessage={(editableContent) => (
        <RenderMessage data={item} editableContent={editableContent} />
      )}
      showTitle={showTitle}
      text={text}
      time={item.updateAt || item.createAt}
      type={type === 'chat' ? 'block' : 'pure'}
    />
  );
});

export default Item;
