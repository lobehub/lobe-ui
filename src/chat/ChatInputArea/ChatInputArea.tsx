'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { DraggablePanel } from '@/DraggablePanel';
import { styleProps } from '@/styles/stylex/props';

import ChatInputAreaInner from './components/ChatInputAreaInner';
import { styles, textareaClassName } from './style';
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
      <section {...stylex.props(styles.container)} style={{ minHeight: heights?.minHeight }}>
        {topAddons}
        <div {...stylex.props(styles.textareaContainer)}>
          <ChatInputAreaInner
            className={textareaClassName}
            ref={ref}
            style={{
              alignItems: 'stretch',
              lineHeight: 1.5,
              paddingBlock: 0,
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
          {...styleProps(styles.fullscreen, className, {
            insetBlockStart: heights?.headerHeight ?? 0,
            ...style,
          })}
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
