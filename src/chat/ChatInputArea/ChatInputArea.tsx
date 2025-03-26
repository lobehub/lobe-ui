'use client';

import { createStyles } from 'antd-style';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { ReactNode, forwardRef, memo } from 'react';

import DraggablePanel, { type DraggablePanelProps } from '@/DraggablePanel';

import ChatInputAreaInner, { type ChatInputAreaInnerProps } from './ChatInputAreaInner';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding-block: 12px 16px;
      padding-inline: 0;
    `,
    textarea: css`
      height: 100% !important;
      padding-block: 0;
      padding-inline: 24px;
      line-height: 1.5;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

export interface ChatInputAreaProps extends Omit<ChatInputAreaInnerProps, 'classNames'> {
  bottomAddons?: ReactNode;
  classNames?: DraggablePanelProps['classNames'];
  expand?: boolean;
  heights?: {
    headerHeight?: number;
    inputHeight?: number;
    maxHeight?: number;
    minHeight?: number;
  };
  onSizeChange?: DraggablePanelProps['onSizeChange'];
  setExpand?: (expand: boolean) => void;
  topAddons?: ReactNode;
}

const ChatInputArea = forwardRef<TextAreaRef, ChatInputAreaProps>(
  (
    {
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
    },
    ref,
  ) => {
    const { styles } = useStyles();

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
              type={'pure'}
              {...rest}
            />
          </div>
          {bottomAddons}
        </section>
      </DraggablePanel>
    );
  },
);

export default memo(ChatInputArea);
