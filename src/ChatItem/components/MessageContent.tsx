import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/ChatItem';
import EditableMessage from '@/EditableMessage';

import { useStyles } from '../style';

export interface LoadingProps {
  editing?: ChatItemProps['editing'];
  message?: ReactNode;
  messageExtra?: ChatItemProps['messageExtra'];
  onChange?: ChatItemProps['onChange'];
  onEditingChange?: ChatItemProps['onEditingChange'];
  placement?: ChatItemProps['placement'];
  primary?: ChatItemProps['primary'];
  renderMessage?: ChatItemProps['renderMessage'];
  text?: ChatItemProps['text'];
  type?: ChatItemProps['type'];
}

const Loading = memo<LoadingProps>(
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
  }) => {
    const { cx, styles } = useStyles({ placement, primary, type });

    const content = (
      <EditableMessage
        classNames={{ textarea: styles.editingInput }}
        editButtonSize={'small'}
        editing={editing}
        fullFeaturedCodeBlock
        onChange={onChange}
        onEditingChange={onEditingChange}
        text={text}
        value={String(message || '...')}
      />
    );
    const messageContent = renderMessage ? renderMessage(content) : content;

    return (
      <Flexbox className={cx(styles.message, editing && styles.editingContainer)}>
        {messageContent}
        {messageExtra && !editing ? (
          <div className={styles.messageExtra}>{messageExtra}</div>
        ) : null}
      </Flexbox>
    );
  },
);

export default Loading;
