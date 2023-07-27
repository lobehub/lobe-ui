import { memo } from 'react';

import type { ChatMessage, DivProps } from '@/types';

import Item, { ListItemProps } from './Item';
import { useStyles } from './style';

export interface ChatListProps extends DivProps, ListItemProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  loadingId?: string;
}

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
    ...props
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...props}>
        {data.map((item) => (
          <Item
            key={item.id}
            onActionClick={onActionClick}
            onMessageChange={onMessageChange}
            renderErrorMessage={renderErrorMessage}
            renderMessage={renderMessage}
            renderMessageExtra={MessageExtra}
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
