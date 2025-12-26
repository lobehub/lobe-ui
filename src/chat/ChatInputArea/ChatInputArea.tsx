'use client';

import { memo } from 'react';

import DraggablePanel from '@/DraggablePanel';

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
    return (
      <DraggablePanel
        className={className}
        classNames={classNames}
        fullscreen={expand}
        headerHeight={heights?.headerHeight}
        maxHeight={heights?.maxHeight}
        minHeight={heights?.minHeight}
        onSizeChange={onSizeChange}
        placement="bottom"
        size={{ height: heights?.inputHeight, width: '100%' }}
        style={{ zIndex: 10, ...style }}
      >
        <section className={styles.container} style={{ minHeight: heights?.minHeight }}>
          {topAddons}
          <div className={styles.textareaContainer}>
            <ChatInputAreaInner
              className={styles.textarea}
              onSend={() => {
                onSend?.();
                setExpand?.(false);
              }}
              ref={ref}
              style={{
                paddingInline: 16,
              }}
              {...rest}
            />
          </div>
          {bottomAddons}
        </section>
      </DraggablePanel>
    );
  },
);

export default ChatInputArea;
