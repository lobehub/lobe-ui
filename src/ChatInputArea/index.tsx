import { Button, type InputRef } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  CSSProperties,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import ActionIcon from '@/ActionIcon';
import { TextArea, type TextAreaProps } from '@/Input';

import InputHighlight from './InputHighlight';
import { useStyles } from './style';

export interface ChatInputAreaProps extends TextAreaProps {
  /**
   * @description Actions to be displayed in the input area
   */
  actions?: ReactNode;
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
   * @description Whether the input area is expanded
   * @default false
   */
  expand?: boolean;
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
   * @description Callback function when the expand state changes
   * @param expand - Whether the input area is expanded
   */
  onExpandChange?: (expand: boolean) => void;
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
      ...props
    },
    ref,
  ) => {
    const isChineseInput = useRef(false);
    const [value, setValue] = useState<string>(defaultValue);
    const { cx, styles } = useStyles();

    const handleExpandClick = useCallback(() => {
      if (onExpandChange) onExpandChange(!expand);
    }, [expand]);

    const handleSend = useCallback(() => {
      if (disabled) return;
      if (onSend) onSend(value);
      setValue('');
    }, [disabled, value]);

    useEffect(() => {
      if (onInputChange) onInputChange(value);
    }, [value]);

    return (
      <section className={cx(styles.container, className)} style={{ minHeight, ...style }}>
        <div className={styles.actionsBar}>
          <div className={styles.actionLeft}>{actions}</div>
          <div className={styles.actionsRight}>
            <ActionIcon icon={expand ? Minimize2 : Maximize2} onClick={handleExpandClick} />
          </div>
        </div>
        <div className={styles.textareaContainer}>
          <InputHighlight target={textareaId} value={value} />
          <TextArea
            className={cx(styles.textarea, textareaClassName)}
            defaultValue={defaultValue}
            id={textareaId}
            ref={ref}
            style={textareaStyle}
            {...props}
            onBlur={(e) => {
              if (onBlur) onBlur(e);
              setValue(e.target.value);
            }}
            onChange={(e) => {
              if (onChange) onChange(e);
              setValue(e.target.value);
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
            value={value}
          />
        </div>
        <div className={styles.footerBar}>
          {footer}
          <Button disabled={disabled} loading={loading} onClick={handleSend} type="primary">
            {text?.send || 'Send'}
          </Button>
        </div>
      </section>
    );
  },
);

export default ChatInputArea;
