import { Button, type InputRef } from 'antd';
import { Loader2, SendHorizonal } from 'lucide-react';
import { CSSProperties, forwardRef, useCallback, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import { Input, type InputProps } from '@/Input';
import MobileSafeArea from '@/MobileSafeArea';

import Action from './Action';
import { useStyles } from './style.mobile';
import type { ChatInputBase } from './type';

export type ChatInputAreaMobile = ChatInputBase &
  InputProps & {
    inputClassName?: string;
    inputId?: string;
    inputStyle?: CSSProperties;
    minHeight?: number;
    safeArea?: boolean;
  };

const ChatInputArea = forwardRef<InputRef, ChatInputAreaMobile>(
  (
    {
      inputClassName,
      style,
      inputStyle,
      minHeight = 200,
      className,
      actions,
      safeArea = true,
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
      inputId = 'lobe-chat-input-area',
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
      <Flexbox className={cx(styles.container, className)} gap={12} style={{ minHeight, ...style }}>
        <Action
          actions={actions}
          actionsRight={actionsRight}
          expand={expand}
          onExpandChange={onExpandChange}
        />
        <Flexbox className={styles.inner} gap={8} horizontal>
          <Input
            className={cx(styles.input, inputClassName)}
            defaultValue={defaultValue}
            id={inputId}
            ref={ref}
            style={inputStyle}
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
            type={'block'}
            value={currentValue}
          />
          <div>
            {loading ? (
              <Button
                disabled={disabled}
                icon={loading && <Icon icon={Loader2} spin />}
                onClick={onStop}
              />
            ) : (
              <Button
                disabled={disabled}
                icon={<Icon icon={SendHorizonal} />}
                onClick={handleSend}
                type={'primary'}
              />
            )}
          </div>
        </Flexbox>
        {safeArea && <MobileSafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

export default ChatInputArea;
