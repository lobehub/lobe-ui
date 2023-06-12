import { Alert, type AlertProps } from 'antd';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { Avatar, Icon, Markdown } from '@/index';
import type { DivProps } from '@/types';
import { MetaData } from '@/types/meta';
import { formatTime } from '@/utils/formatTime';

import { useStyles } from './style';

const AVATAR_SIZE = 40;

export interface ChatItemProps extends DivProps {
  /**
   * @description Whether to show alert and alert config
   */
  alert?: AlertProps;
  /**
   * @description Avatar config
   */
  avatar: MetaData;
  /**
   * @description Whether to add spacing between chat items
   * @default true
   */
  borderSpacing?: boolean;
  /**
   * @description Whether to show a loading spinner
   * @default false
   */
  loading?: boolean;
  /**
   * @description The message to be displayed
   */
  message?: string;
  /**
   * @description The placement of the chat item
   * @default 'left'
   */
  placement?: 'left' | 'right';
  /**
   * @description Whether the chat item is primary
   * @default false
   */
  primary?: boolean;
  /**
   * @description Whether to show name of the chat item
   * @default false
   */
  showTitle?: boolean;
  /**
   * @description Time of chat message
   */
  time?: number;
  /**
   * @description The type of chat item
   * @default 'block'
   */
  type?: 'block' | 'pure';
}

const ChatItem = memo<ChatItemProps>(
  ({
    className,
    title,
    primary,
    borderSpacing = true,
    loading,
    message,
    placement = 'left',
    type = 'block',
    avatar,
    alert,
    showTitle,
    time,
    ...props
  }) => {
    const { cx, styles } = useStyles({
      placement,
      type,
      title,
      primary,
      avatarSize: AVATAR_SIZE,
      showTitle,
    });
    return (
      <div className={cx(styles.container, className)} {...props}>
        <div className={styles.avatarContainer}>
          <Avatar
            avatar={avatar.avatar}
            background={avatar.backgroundColor}
            size={AVATAR_SIZE}
            title={avatar.title}
          />
          {loading && (
            <div className={styles.loading}>
              <Icon icon={Loader2} size={{ fontSize: 12, strokeWidth: 3 }} spin />
            </div>
          )}
        </div>
        <div className={styles.messageContainer}>
          <div className={cx(styles.name, 'chat-item-name')}>
            {showTitle ? avatar.title || 'untitled' : null}
            {time && (
              <span className={cx(type === 'pure' && !showTitle && styles.time, 'chat-item-time')}>
                {formatTime(time)}
              </span>
            )}
          </div>
          {alert ? (
            <Alert showIcon {...alert} />
          ) : (
            <div className={styles.message}>
              <Markdown>{String(message || '...')}</Markdown>
            </div>
          )}
        </div>
        {borderSpacing && <div style={{ width: AVATAR_SIZE, flex: 'none' }} />}
      </div>
    );
  },
);

export default ChatItem;
