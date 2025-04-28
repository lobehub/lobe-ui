import { App } from 'antd';
import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import type { AlertProps } from '@/Alert';
import ChatItem from '@/chat/ChatItem';
import type { ChatMessage } from '@/chat/types';
import { copyToClipboard } from '@/utils/copyToClipboard';

import type { ChatListItemProps, ListItemProps } from '../type';
import ChatActionsBar from './ChatActionsBar';

const ChatListItem = memo<ChatListItemProps>((props) => {
  const {
    renderMessagesExtra,
    showTitle,
    onActionsClick,
    onAvatarsClick,
    onMessageChange,
    variant,
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
    ({ editableContent, data }: { data: ChatMessage; editableContent: ReactNode }) => {
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
      if (!RenderFunction) return;
      return <RenderFunction {...data} />;
    },
    [renderMessagesExtra?.[item.role]],
  );

  const ErrorMessage = useCallback(
    ({ data }: { data: ChatMessage }) => {
      if (!renderErrorMessages || !item?.error?.type) return;
      let RenderFunction;
      if (renderErrorMessages?.[item.error.type])
        RenderFunction = renderErrorMessages[item.error.type].Render;
      if (!RenderFunction && renderErrorMessages?.['default'])
        RenderFunction = renderErrorMessages['default'].Render;
      if (!RenderFunction) return;
      return <RenderFunction {...data} />;
    },
    [renderErrorMessages],
  );

  const Actions = useCallback(
    ({ data }: { data: ChatMessage }) => {
      if (!renderActions || !item?.role) return;
      let RenderFunction;
      if (renderActions?.[item.role]) RenderFunction = renderActions[item.role];
      if (renderActions?.['default']) RenderFunction = renderActions['default'];
      if (!RenderFunction) RenderFunction = ChatActionsBar;

      const handleActionClick: ListItemProps['onActionsClick'] = async (action, data) => {
        switch (action.key) {
          case 'copy': {
            await copyToClipboard(data.content);
            message.success(text?.copySuccess || 'Copy Success');
            break;
          }
          case 'edit': {
            setEditing(true);
          }
        }

        onActionsClick?.(action, data);
      };

      return (
        <RenderFunction
          {...data}
          onActionClick={(actionKey) => handleActionClick?.(actionKey, data)}
          text={text}
        />
      );
    },
    [renderActions?.[item.role], text, onActionsClick],
  );

  const error = useMemo(() => {
    if (!item.error) return;
    const message = item.error?.message;
    let alertConfig = {};
    if (item.error.type && renderErrorMessages?.[item.error.type]) {
      alertConfig = renderErrorMessages[item.error.type]?.config as AlertProps;
    }
    return {
      message,
      ...alertConfig,
    };
  }, [renderErrorMessages, item.error]);

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
      onAvatarClick={onAvatarsClick?.(item.role)}
      onChange={(value) => onMessageChange?.(item.id, value)}
      onDoubleClick={(e) => {
        if (item.id === 'default' || item.error) return;
        if (item.role && ['assistant', 'user'].includes(item.role) && e.altKey) {
          setEditing(true);
        }
      }}
      onEditingChange={setEditing}
      placement={variant === 'bubble' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
      primary={item.role === 'user'}
      renderMessage={(editableContent) => (
        <RenderMessage data={item} editableContent={editableContent} />
      )}
      showTitle={showTitle}
      text={text}
      time={item.updateAt || item.createAt}
      variant={variant}
    />
  );
});

ChatListItem.displayName = 'ChatListItem';

export default ChatListItem;
