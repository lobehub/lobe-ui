import { Button } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import { TextArea } from '@/Input';
import type { DivProps } from '@/types';

import { useStyles } from './style';

export interface ChatInputAreaProps extends DivProps {
  actions?: ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  expand?: boolean;
  footer?: ReactNode;
  loading?: boolean;
  minHeight?: number;
  onExpandChange?: (expand: boolean) => void;
  onInputChange?: (value: string) => void;
  onSend?: (value: string) => void;
  placeholder?: string;
}

const ChatInputArea = memo<ChatInputAreaProps>(
  ({
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
    style,
    disabled,
    onInputChange,
    ...props
  }) => {
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
      <section
        className={cx(styles.container, className)}
        style={{ minHeight, ...style }}
        {...props}
      >
        <div className={styles.actionsBar}>
          <div className={styles.actionLeft}>{actions}</div>
          <div className={styles.actionsRight}>
            <ActionIcon icon={expand ? Minimize2 : Maximize2} onClick={handleExpandClick} />
          </div>
        </div>
        <TextArea
          className={styles.textarea}
          defaultValue={defaultValue}
          onBlur={(e) => setValue(e.target.value)}
          onChange={(e) => setValue(e.target.value)}
          onCompositionEnd={() => {
            isChineseInput.current = false;
          }}
          onCompositionStart={() => {
            isChineseInput.current = true;
          }}
          onPressEnter={(e) => {
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
        <div className={styles.footerBar}>
          {footer}
          <Button disabled={disabled} loading={loading} onClick={handleSend} type="primary">
            Send
          </Button>
        </div>
      </section>
    );
  },
);

export default ChatInputArea;
