import { useResponsive } from 'antd-style';
import { motion } from 'motion/react';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import type { MarkdownProps } from '@/Markdown';
import { ChatItemProps } from '@/chat/ChatItem';
import EditableMessage from '@/chat/EditableMessage';

import { useStyles } from '../style';

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
    fontSize,
    markdownProps,
  }) => {
    const { cx, styles } = useStyles({ editing, placement, primary, type });
    const { mobile } = useResponsive();

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
        className={cx(styles.message, editing && styles.editingContainer)}
        onDoubleClick={onDoubleClick}
      >
        <motion.div
          layout={'size'}
          style={{
            // 双重定位起点
            height: 'auto',
            // 从顶部开始动画
            originY: 0,
            overflow: 'hidden',
            transformOrigin: 'top', // 关键声明
          }}
          transition={{
            bounce: 0.15,
            duration: 0.25,
            layout: { duration: 0.2, ease: 'easeOut', type: 'tween' },
            type: 'spring',
          }}
        >
          <motion.div layout="position">
            {messageContent}
            {messageExtra && !editing ? (
              <div className={styles.messageExtra}>{messageExtra}</div>
            ) : null}
          </motion.div>
        </motion.div>
      </Flexbox>
    );
  },
);

export default MessageContent;
