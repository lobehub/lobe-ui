'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { DraggablePanel } from '@/DraggablePanel';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import ChatInputAreaInner from './components/ChatInputAreaInner';
import { chatChatInputAreaClasses } from './stable';
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
      <section
        {...styleProps(styles.container, chatChatInputAreaClasses('content'), {
          minHeight: heights?.minHeight,
        })}
      >
        {topAddons}
        <div
          {...styleProps(styles.textareaContainer, chatChatInputAreaClasses('textarea-wrapper'))}
        >
          <ChatInputAreaInner
            className={clsx(chatChatInputAreaClasses('textarea'), textareaClassName)}
            ref={ref}
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
          {...styleProps(styles.fullscreen, clsx(chatChatInputAreaClasses(), className), {
            insetBlockStart: heights?.headerHeight,
            ...style,
          })}
          {...toDataAttributes({ expand })}
        >
          {content}
        </div>
      );

    return (
      <DraggablePanel
        className={clsx(chatChatInputAreaClasses(), className)}
        classNames={classNames}
        maxHeight={heights?.maxHeight}
        minHeight={heights?.minHeight}
        placement="bottom"
        size={{ height: heights?.inputHeight, width: '100%' }}
        style={style}
        onSizeChange={onSizeChange}
      >
        {content}
      </DraggablePanel>
    );
  },
);

export default ChatInputArea;
