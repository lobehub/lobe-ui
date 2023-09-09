import { Button, type InputRef } from 'antd';
import { Loader2 } from 'lucide-react';
import { CSSProperties, ReactNode, forwardRef, useCallback, useRef } from 'react';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import { TextArea, type TextAreaProps } from '@/Input';

import Action, { ActionProps } from './Action';
import { useStyles } from './style';

export interface ChatInputAreaProps extends ActionProps, TextAreaProps {
  /**
   * @description Additional class name for the component
   */
  className?: string;
  /**
   * @description Default value for the input area
   */
  defaultValue?: string;
  /**
   * @description Whether the input area is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * @description Footer content to be displayed below the input area
   */
  footer?: ReactNode;
  /**
   * @description Whether the input area is in loading state
   * @default false
   */
  loading?: boolean;
  /**
   * @description Minimum height of the input area
   * @default 200
   */
  minHeight?: number;
  /**
   * @description Callback function when the input value changes
   * @param value - The current value of the input area
   */
  onInputChange?: (value: string) => void;
  /**
   * @description Callback function when the send button is clicked
   * @param value - The current value of the input area
   */
  onSend?: (value: string) => void;
  onStop?: () => void;
  /**
   * @description Placeholder text for the input area
   * @default 'Type something to chat...'
   */
  placeholder?: string;
  /**
   * @description CSS styles for the component
   */
  style?: CSSProperties;
  text?: {
    send?: string;
    stop?: string;
  };
  /**
   * @description Additional class name for the textarea element
   */
  textareaClassName?: string;
  textareaId?: string;
  /**
   * @description CSS styles for the textarea element
   */
  textareaStyle?: CSSProperties;
  value?: string;
}

const ChatInputArea = forwardRef<InputRef, ChatInputAreaProps>(
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
