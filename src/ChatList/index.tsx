import { memo } from 'react';

import type { ChatMessage, DivProps } from '@/types';

import Group from './Group';
import Item, { ListItemProps } from './Item';
import { useStyles } from './style';

export interface ChatListProps extends DivProps, ListItemProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  loadingId?: string;
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
          const props = {
            loading: loadingId === item.id,
            onActionClick,
            onMessageChange,
            renderErrorMessage,
            renderItem,
            renderMessage,
            renderMessageExtra: MessageExtra,
            showTitle,
            text,
            type,
          };

          if (item.children && item.children?.length > 0) {
            return (
              <Group
                data={item.children.map((childrenItem) => ({ ...props, ...childrenItem }))}
                key={item.children[0].id}
                meta={item.meta}
              />
            );
          }

          return <Item key={item.id} {...props} {...item} />;
        })}
      </div>
    );
  },
);

export default ChatList;
