import { Alert, type AlertProps } from 'antd';
import { Loader2 } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Avatar from '@/Avatar';
import EditableMessage from '@/EditableMessage';
import Icon from '@/Icon';
import { MetaData } from '@/types/meta';
import { formatTime } from '@/utils/formatTime';

import { useStyles } from './style';

const AVATAR_SIZE = 40;

export interface ChatItemProps {
  /**
   * @description Actions to be displayed in the chat item
   */
  actions?: ReactNode;
  /**
   * @description Props for Alert component
   */
  alert?: AlertProps;
  /**
   * @description Metadata for the avatar
   */
  avatar: MetaData;
  /**
   * @description Whether to add border spacing
   */
  borderSpacing?: number | string;
  /**
   * @description Custom CSS class name for the chat item
   */
  className?: string;
  /**
   * @description Whether the chat item is in editing mode
   */
  editing?: boolean;
  /**
   * @description Whether the chat item is in loading state
   */
  loading?: boolean;
  /**
   * @description The message content of the chat item
   */
  message?: string;
  messageExtra?: ReactNode;
  /**
   * @description Callback when the message content changes
   * @param value - The new message content
   */
  onChange?: (value: string) => void;
  /**
   * @description Callback when the editing mode changes
   * @param editing - The new editing mode
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @description The placement of the chat item
   * @default 'left'
   */
  placement?: 'left' | 'right';
  /**
   * @description Whether the chat item is primary
   */
  primary?: boolean;
  /**
   * @description Whether to show the title of the chat item
   */
  showTitle?: boolean;

  /**
   * @description The timestamp of the chat item
   */
  time?: number;
  /**
   * @description The type of the chat item
   * @default 'block'
   */
  type?: 'block' | 'pure';
}

const ChatItem = memo<ChatItemProps>(
  ({
    actions,
    className,
    primary,
    borderSpacing,
    loading,
    message,
    placement = 'left',
    type = 'block',
    avatar,
    alert,
    showTitle,
    time,
    editing,
    onChange,
    onEditingChange,
    messageExtra,
    ...properties
  }) => {
    const { cx, styles } = useStyles({
      avatarSize: AVATAR_SIZE,
      placement,
      primary,
      showTitle,
      title: avatar.title,
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
          <title className={styles.name}>
            {showTitle ? avatar.title || 'untitled' : undefined}
            {time && <time>{formatTime(time)}</time>}
          </title>
          <div className={styles.messageContent}>
            {alert ? (
              <Alert className={styles.alert} showIcon {...alert} />
            ) : (
              <Flexbox className={styles.message} style={editing ? { padding: 12 } : {}}>
                <EditableMessage
                  editing={editing}
                  onChange={onChange}
                  onEditingChange={onEditingChange}
                  value={String(message || '...')}
                />

                {messageExtra ? <div className={styles.messageExtra}>{messageExtra}</div> : null}
              </Flexbox>
            )}
            {!editing && (
              <div className={styles.actions} role="chat-item-actions">
                {actions}
              </div>
            )}
          </div>
        </div>
        {borderSpacing && <div style={{ flex: 'none', width: borderSpacing }} />}
      </div>
    );
  },
);

export default ChatItem;
