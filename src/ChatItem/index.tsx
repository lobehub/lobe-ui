import { Alert, type AlertProps } from 'antd';
import { Loader2 } from 'lucide-react';
import { ReactNode, memo } from 'react';

import Avatar from '@/Avatar';
import Icon from '@/Icon';
import Markdown from '@/Markdown';
import type { DivProps } from '@/types';
import { MetaData } from '@/types/meta';
import { formatTime } from '@/utils/formatTime';

import { useStyles } from './style';

const AVATAR_SIZE = 40;

export interface ChatItemProps extends DivProps {
  actions?: ReactNode;
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
    actions,
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
    ...properties
  }) => {
    const { cx, styles } = useStyles({
      avatarSize: AVATAR_SIZE,
      borderSpacing,
      placement,
      primary,
      showTitle,
      title,
      type,
    });
    return (
      <div className={cx(styles.container, className)} {...properties}>
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
            {showTitle ? avatar.title || 'untitled' : undefined}
            {time && <span className="chat-item-time">{formatTime(time)}</span>}
          </div>
          {alert ? (
            <Alert showIcon {...alert} />
          ) : (
            <div className={styles.message}>
              <Markdown>{String(message || '...')}</Markdown>
            </div>
          )}
          <div className={cx(styles.actions, 'chat-item-actions')}>{actions}</div>
        </div>
        {borderSpacing && <div style={{ flex: 'none', width: AVATAR_SIZE }} />}
      </div>
    );
  },
);

export default ChatItem;
