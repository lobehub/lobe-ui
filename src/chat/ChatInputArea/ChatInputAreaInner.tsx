'use client';

import { TextAreaRef } from 'antd/es/input/TextArea';
import { CSSProperties, forwardRef, memo, useRef } from 'react';

import { TextArea, TextAreaProps } from '@/Input';

export interface ChatInputAreaInnerProps extends Omit<TextAreaProps, 'onInput'> {
  className?: string;
  loading?: boolean;
  onInput?: (value: string) => void;
  onSend?: () => void;
  style?: CSSProperties;
}

const ChatInputAreaInner = forwardRef<TextAreaRef, ChatInputAreaInnerProps>(
  (
    {
      resize = false,
      onCompositionEnd,
      onPressEnter,
      onCompositionStart,
      className,
      onInput,
      loading,
      onSend,
      onBlur,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const isChineseInput = useRef(false);

    return (
      <TextArea
        className={className}
        onBlur={(e) => {
          onInput?.(e.target.value);
          onBlur?.(e);
        }}
        onChange={(e) => {
          onInput?.(e.target.value);
          onChange?.(e);
        }}
        onCompositionEnd={(e) => {
          isChineseInput.current = false;
          onCompositionEnd?.(e);
        }}
        onCompositionStart={(e) => {
          isChineseInput.current = true;
          onCompositionStart?.(e);
        }}
        onPressEnter={(e) => {
          onPressEnter?.(e);
          const isMobile = /mobi|android|iphone/i.test(navigator.userAgent);
          if (
            !loading &&
            !isChineseInput.current &&
            ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
          ) {
            e.preventDefault();
            onSend?.();
          }
        }}
        ref={ref}
        resize={resize}
        {...rest}
      />
    );
  },
);

export default memo(ChatInputAreaInner);
