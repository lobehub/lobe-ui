import { Alert, type AlertProps } from 'antd';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { Avatar, Icon, Markdown } from '@/index';
import type { DivProps } from '@/types';

import { useStyles } from './style';

const AVATAR_SIZE = 40;

export interface ChatItemProps extends DivProps {
  /**
   * @description Weather to show alert and alert config
   */
  alert?: AlertProps;
  /**
   * @description URL of the avatar image
   */
  avatar?: string;
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
   * @description The name of the chat item
   */
  name?: string;
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
   * @description The type of chat item
   * @default 'block'
   */
  type?: 'block' | 'pure';
}

const ChatItem = memo<ChatItemProps>(
  ({
    className,
    name,
    primary,
    borderSpacing = true,
    loading,
    message,
    placement = 'left',
    type = 'block',
    avatar,
    alert,
    ...props
  }) => {
    const { cx, styles } = useStyles({ placement, type, name, primary, avatarSize: AVATAR_SIZE });
    return (
      <div className={cx(styles.container, className)} {...props}>
        <div className={styles.avatarContainer}>
          <Avatar avatar={avatar} size={AVATAR_SIZE} />
          {loading && (
            <div className={styles.loading}>
              <Icon icon={Loader2} size={{ fontSize: 12, strokeWidth: 3 }} spin />
            </div>
          )}
        </div>
        <div className={styles.messageContainer}>
          {name && <div className={styles.name}>{name}</div>}
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
