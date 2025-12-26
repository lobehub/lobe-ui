import { cx, useResponsive } from 'antd-style';
import { type ReactNode, memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import type { MarkdownProps } from '@/Markdown';
import { ChatItemProps } from '@/chat/ChatItem';
import EditableMessage from '@/chat/EditableMessage';

import { styles } from '../style';

export interface MessageContentProps {
  editing?: ChatItemProps['editing'];
  fontSize?: number;
  markdownProps?: Omit<MarkdownProps, 'className' | 'style' | 'children'>;
  message?: ReactNode;
  messageExtra?: ChatItemProps['messageExtra'];
  onChange?: ChatItemProps['onChange'];
  onDoubleClick?: ChatItemProps['onDoubleClick'];
  onEditingChange?: ChatItemProps['onEditingChange'];
  placement?: ChatItemProps['placement'];
  primary?: ChatItemProps['primary'];
  renderMessage?: ChatItemProps['renderMessage'];
  text?: ChatItemProps['text'];
  variant?: ChatItemProps['variant'];
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
    variant,
    primary,
    onDoubleClick,
    fontSize,
    markdownProps,
  }) => {
    // placement and primary are part of the interface but not used in this component
    void placement;
    void primary;
    const { mobile } = useResponsive();

    const messageClassName = useMemo(() => {
      if (variant === 'bubble') return styles.messageBubble;
      // For docs variant, we need title info, but we don't have it here
      // Use withoutTitle as default
      return styles.messageDocsWithoutTitle;
    }, [variant]);

    const editingContainerClassName = useMemo(() => {
      return variant === 'docs' ? styles.editingContainerDocs : styles.editingContainer;
    }, [variant]);

    const content = (
      <EditableMessage
        classNames={{ input: styles.editingInput }}
        editButtonSize={'small'}
        editing={editing}
        fontSize={fontSize}
        fullFeaturedCodeBlock
        markdownProps={markdownProps}
        onChange={onChange}
        onEditingChange={onEditingChange}
        openModal={mobile ? editing : undefined}
        text={text}
        value={message ? String(message) : ''}
      />
    );
    const messageContent = renderMessage ? renderMessage(content) : content;

    return (
      <Flexbox
        className={cx(messageClassName, editing && editingContainerClassName)}
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
