import { Fragment, memo } from 'react';

import type { ChatMessage, DivProps } from '@/types';

import Group from './Group';
import HistoryDivider from './HistoryDivider';
import Item, { ListItemProps } from './Item';
import { useStyles } from './style';

export interface ChatListProps extends DivProps, ListItemProps {
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  enableHistoryCount?: boolean;
  historyCount?: number;
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
    enableHistoryCount,
    historyCount = 0,
    ...props
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...props}>
        {data.map((item, index) => {
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

          const historyLength = data.length;
          const enableHistoryDivider =
            enableHistoryCount &&
            historyLength > historyCount &&
            historyCount === historyLength - index + 1;

          if (item.children && item.children?.length > 0) {
            return (
              <Fragment key={item.children[0].id}>
                <HistoryDivider enable={enableHistoryDivider} text={text} />
                <Group
                  data={item.children.map((childrenItem) => ({ ...props, ...childrenItem }))}
                  meta={item.meta}
                />
              </Fragment>
            );
          }

          return (
            <Fragment key={item.id}>
              <HistoryDivider enable={enableHistoryDivider} text={text} />
              <Item {...props} {...item} />
            </Fragment>
          );
        })}
      </div>
    );
  },
);

export default ChatList;
