import { memo } from 'react';

import Actions from './components/Actions';
import Avatar from './components/Avatar';
import BorderSpacing from './components/BorderSpacing';
import ErrorContent from './components/ErrorContent';
import MessageContent from './components/MessageContent';
import Title from './components/Title';
import { useStyles } from './style';
import type { ChatItemProps } from './type';

const ChatItem = memo<ChatItemProps>(
  ({
    avatarAddon,
    onAvatarClick,
    actions,
    className,
    primary,
    borderSpacing,
    loading,
    message,
    placement = 'left',
    type = 'block',
    avatar,
    error,
    showTitle,
    time,
    editing,
    onChange,
    onEditingChange,
    messageExtra,
    renderMessage,
    text,
    ErrorMessage,
    ...props
  }) => {
    const { cx, styles } = useStyles({
      placement,
      primary,
      showTitle,
      title: avatar.title,
      type,
    });

    return (
      <div className={cx(styles.container, className)} {...props}>
        <Avatar
          addon={avatarAddon}
          avatar={avatar}
          loading={loading}
          onClick={onAvatarClick}
          placement={placement}
        />
        <div className={styles.messageContainer}>
          <Title avatar={avatar} placement={placement} showTitle={showTitle} time={time} />
          <div className={styles.messageContent}>
            {error ? (
              <ErrorContent ErrorMessage={ErrorMessage} error={error} placement={placement} />
            ) : (
              <MessageContent
                editing={editing}
                message={message}
                messageExtra={messageExtra}
                onChange={onChange}
                onEditingChange={onEditingChange}
                placement={placement}
                primary={primary}
                renderMessage={renderMessage}
                text={text}
                type={type}
              />
            )}
            {!editing && <Actions actions={actions} placement={placement} type={type} />}
          </div>
        </div>
        <BorderSpacing borderSpacing={borderSpacing} />
      </div>
    );
  },
);

export default ChatItem;

export type { ChatItemProps } from './type';
