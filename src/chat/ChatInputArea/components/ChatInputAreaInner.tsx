'use client';

import { memo, useRef } from 'react';

import { TextArea } from '@/Input';

import { ChatInputAreaInnerProps } from '../type';

const ChatInputAreaInner = memo<ChatInputAreaInnerProps>(
  ({
    ref,
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
  }) => {
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
        variant={'borderless'}
        {...rest}
      />
    );
  },
);

export default ChatInputAreaInner;
