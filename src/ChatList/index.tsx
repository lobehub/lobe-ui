import { Fragment, memo } from 'react';

import type { ChatMessage, DivProps } from '@/types';

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
export type {
  OnActionsClick,
  OnAvatatsClick,
  OnMessageChange,
  RenderAction,
  RenderErrorMessage,
  RenderItem,
  RenderMessage,
  RenderMessageExtra,
} from './Item';

const ChatList = memo<ChatListProps>(
  ({
    onActionsClick,
    onAvatarsClick,
    renderMessagesExtra,
    className,
    data,
    type = 'chat',
    text,
    showTitle,
    onMessageChange,
    renderMessages,
    renderErrorMessages,
    loadingId,
    renderItems,
    enableHistoryCount,
    renderActions,
    historyCount = 0,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...rest}>
        {data.map((item, index) => {
          const itemProps = {
            loading: loadingId === item.id,
            onActionsClick,
            onAvatarsClick,
            onMessageChange,
            renderActions,
            renderErrorMessages,
            renderItems,
            renderMessages,
            renderMessagesExtra,
            showTitle,
            text,
            type,
          };

          const historyLength = data.length;
          const enableHistoryDivider =
            enableHistoryCount &&
            historyLength > historyCount &&
            historyCount === historyLength - index + 1;

          return (
            <Fragment key={item.id}>
              <HistoryDivider enable={enableHistoryDivider} text={text?.history} />
              <Item {...itemProps} {...item} />
            </Fragment>
          );
        })}
      </div>
    );
  },
);

export default ChatList;
