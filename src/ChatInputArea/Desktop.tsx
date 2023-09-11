import { Button, type InputRef } from 'antd';
import { Loader2 } from 'lucide-react';
import { CSSProperties, forwardRef, useCallback, useRef } from 'react';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import { TextArea, type TextAreaProps } from '@/Input';

import Action from './Action';
import { useStyles } from './style';
import type { ChatInputBase } from './type';

export type ChatInputAreaDesktop = ChatInputBase &
  TextAreaProps & {
    minHeight?: number;
    textareaClassName?: string;
    textareaId?: string;
    textareaStyle?: CSSProperties;
  };

const ChatInputArea = forwardRef<InputRef, ChatInputAreaDesktop>(
  (
    {
      text,
      textareaClassName,
      style,
      textareaStyle,
      minHeight = 200,
      className,
      actions,
      footer,
      expand,
      placeholder = 'Type something to chat...',
      onExpandChange,
      onSend,
      defaultValue = '',
      loading,
      disabled,
      onInputChange,
      onPressEnter,
      onCompositionStart,
      onCompositionEnd,
      onBlur,
      onChange,
      textareaId = 'lobe-chat-input-area',
      actionsRight,
      onStop,
      value,
      ...props
    },
    ref,
  ) => {
    const [currentValue, setCurrentValue] = useControlledState<string>(defaultValue, {
      defaultValue,
      onChange: onInputChange,
      value,
    });
    const { cx, styles } = useStyles();
    const isChineseInput = useRef(false);

    const handleSend = useCallback(() => {
      if (loading && disabled) return;
      if (onSend) onSend(currentValue);
      setCurrentValue('');
    }, [disabled, currentValue]);

    return (
      <section className={cx(styles.container, className)} style={{ minHeight, ...style }}>
        <Action
          actions={actions}
          actionsRight={actionsRight}
          expand={expand}
          onExpandChange={onExpandChange}
        />
        <div className={styles.textareaContainer}>
          <TextArea
            className={cx(styles.textarea, textareaClassName)}
            defaultValue={defaultValue}
            id={textareaId}
            ref={ref}
            style={textareaStyle}
            {...props}
            onBlur={(e) => {
              if (onBlur) onBlur(e);
              setCurrentValue(e.target.value);
            }}
            onChange={(e) => {
              if (onChange) onChange(e);
              setCurrentValue(e.target.value);
            }}
            onCompositionEnd={(e) => {
              if (onCompositionEnd) onCompositionEnd(e);
              isChineseInput.current = false;
            }}
            onCompositionStart={(e) => {
              if (onCompositionStart) onCompositionStart(e);
              isChineseInput.current = true;
            }}
            onPressEnter={(e) => {
              if (onPressEnter) onPressEnter(e);
              if (!loading && !e.shiftKey && !isChineseInput.current) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            resize={false}
            type="pure"
            value={currentValue}
          />
        </div>
        <div className={styles.footerBar}>
          {footer}
          {loading ? (
            <Button
              disabled={disabled}
              icon={loading && <Icon icon={Loader2} spin />}
              onClick={onStop}
            >
              {text?.stop || 'Stop'}
            </Button>
          ) : (
            <Button disabled={disabled} onClick={handleSend} type={'primary'}>
              {text?.send || 'Send'}
            </Button>
          )}
        </div>
      </section>
    );
  },
);

export default ChatInputArea;
