import { useResponsive } from 'antd-style';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/ChatItem';
import EditableMessage from '@/EditableMessage';

import { useStyles } from '../style';

export interface MessageContentProps {
  editing?: ChatItemProps['editing'];
  message?: ReactNode;
  messageExtra?: ChatItemProps['messageExtra'];
  onChange?: ChatItemProps['onChange'];
  onDoubleClick?: ChatItemProps['onDoubleClick'];
  onEditingChange?: ChatItemProps['onEditingChange'];
  placement?: ChatItemProps['placement'];
  primary?: ChatItemProps['primary'];
  renderMessage?: ChatItemProps['renderMessage'];
  text?: ChatItemProps['text'];
  type?: ChatItemProps['type'];
}

const MessageContent = memo<MessageContentProps>(
  ({
    editing,
    onChange,
    onEditingChange,
    text,
    message,
    placement,
    messageExtra,
    renderMessage,
    type,
    primary,
    onDoubleClick,
  }) => {
    const { cx, styles } = useStyles({ editing, placement, primary, type });
    const { mobile } = useResponsive();

    const content = (
      <EditableMessage
        classNames={{ input: styles.editingInput }}
        editButtonSize={'small'}
        editing={editing}
        fullFeaturedCodeBlock
        onChange={onChange}
        onEditingChange={onEditingChange}
        openModal={mobile ? editing : undefined}
        text={text}
        value={message ? String(message).trim() : ''}
      />
    );
    const messageContent = renderMessage ? renderMessage(content) : content;

    return (
      <Flexbox
        className={cx(styles.message, editing && styles.editingContainer)}
        onDoubleClick={onDoubleClick}
      >
        {messageContent}
        {messageExtra && !editing ? (
          <div className={styles.messageExtra}>{messageExtra}</div>
        ) : null}
      </Flexbox>
    );
  },
);

export default MessageContent;
