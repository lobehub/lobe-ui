import * as stylex from '@stylexjs/stylex';
import { memo, type ReactNode } from 'react';

import { type ChatItemProps } from '@/chat/ChatItem';
import EditableMessage from '@/chat/EditableMessage';
import { Flexbox } from '@/Flex';
import { type MarkdownProps } from '@/Markdown';
import { useResponsive } from '@/styles/theme/scope';

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
    const isBubble = variant === 'bubble';

    const content = (
      <EditableMessage
        fullFeaturedCodeBlock
        classNames={{ input: stylex.props(styles.editingInput).className }}
        editButtonSize={'small'}
        editing={editing}
        fontSize={fontSize}
        markdownProps={markdownProps}
        openModal={mobile ? editing : undefined}
        text={text}
        value={message ? String(message) : ''}
        onChange={onChange}
        onEditingChange={onEditingChange}
      />
    );
    const messageContent = renderMessage ? renderMessage(content) : content;

    return (
      <Flexbox
        paddingBlock={editing ? '8px 12px' : isBubble ? 8 : '6px 0'}
        paddingInline={editing || isBubble ? 12 : 0}
        width={editing ? '100%' : undefined}
        onDoubleClick={onDoubleClick}
        {...stylex.props(
          isBubble && styles.messageBubble,
          styles.messageBox,
          styles.narrowFullWidth,
          editing && [styles.editingContainer, !isBubble && styles.editingContainerDocs],
        )}
      >
        {messageContent}
        {messageExtra && !editing ? <div>{messageExtra}</div> : null}
      </Flexbox>
    );
  },
);

export default MessageContent;
