import { ReactNode, memo } from 'react';

import type { ChatMessage, DivProps, MessageRoleType } from '@/types';

import Item, { ListItemProps } from './Item';
import { useStyles } from './style';

export interface ChatListProps extends DivProps, ListItemProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  loadingId?: string;
  renderItem?: {
    [role: MessageRoleType | string]: (
      data: { key: string } & ChatMessage & ListItemProps,
    ) => ReactNode;
  };
}
export type { OnActionClick, OnMessageChange, RenderErrorMessage, RenderMessage } from './Item';

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
    renderErrorMessage,
    loadingId,
    renderItem,
    ...props
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...props}>
        {data.map((item) => {
          const key = item.id;
          const props = {
            loading: loadingId === item.id,
            onActionClick,
            onMessageChange,
            renderErrorMessage,
            renderMessage,
            renderMessageExtra: MessageExtra,
            showTitle,
            text,
            type,
            ...item,
          };
          if (renderItem && renderItem[item.role]) {
            return renderItem[item.role]({ key, ...props });
          }
          return <Item key={key} {...props} />;
        })}
      </div>
    );
  },
);

export default ChatList;
