'use client';

import { memo } from 'react';

import { DraggablePanel } from '@/DraggablePanel';
import { cx } from '@/styles';

import ChatInputAreaInner from './components/ChatInputAreaInner';
import { styles } from './style';
import type { ChatInputAreaProps } from './type';

const ChatInputArea = memo<ChatInputAreaProps>(
  ({
    ref,
    className,
    style,
    classNames,
    expand = true,
    setExpand,
    bottomAddons,
    topAddons,
    onSizeChange,
    heights,
    onSend,
    ...rest
  }) => {
    const content = (
      <section className={styles.container} style={{ minHeight: heights?.minHeight }}>
        {topAddons}
        <div className={styles.textareaContainer}>
          <ChatInputAreaInner
            className={styles.textarea}
            ref={ref}
            style={{
              paddingInline: 16,
            }}
            onSend={() => {
              onSend?.();
              setExpand?.(false);
            }}
            {...rest}
          />
        </div>
        {bottomAddons}
      </section>
    );

    if (expand)
      return (
        <div
          className={cx(styles.fullscreen, className)}
          style={{ insetBlockStart: heights?.headerHeight ?? 0, ...style }}
        >
          {content}
        </div>
      );

    return (
      <DraggablePanel
        className={className}
        classNames={classNames}
        maxHeight={heights?.maxHeight}
        minHeight={heights?.minHeight}
        placement="bottom"
        size={{ height: heights?.inputHeight, width: '100%' }}
        style={{ zIndex: 10, ...style }}
        onSizeChange={onSizeChange}
      >
        {content}
      </DraggablePanel>
    );
  },
);

export default ChatInputArea;
