'use client';

import { Fragment, memo } from 'react';

import ChatListItem from './components/ChatListItem';
import HistoryDivider from './components/HistoryDivider';
import { useStyles } from './style';
import type { ChatListProps } from './type';

const ChatList = memo<ChatListProps>(
  ({
    onActionsClick,
    onAvatarsClick,
    renderMessagesExtra,
    className,
    data,
    variant = 'bubble',
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
    hideAvatar,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    return (
      <div className={cx(styles.container, className)} {...rest}>
        {data.map((item, index) => {
          const itemProps = {
            hideAvatar,
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
            variant,
          };

          const historyLength = data.length;
          const enableHistoryDivider =
            enableHistoryCount &&
            historyLength > historyCount &&
            historyCount === historyLength - index + 1;

          return (
            <Fragment key={item.id}>
              <HistoryDivider enable={enableHistoryDivider} text={text?.history} />
              <ChatListItem {...itemProps} {...item} />
            </Fragment>
          );
        })}
      </div>
    );
  },
);

export default ChatList;
