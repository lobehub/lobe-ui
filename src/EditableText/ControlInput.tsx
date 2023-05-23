import { Button, ConfigProvider, Input, InputProps, InputRef } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

export interface ControlInputProps extends Omit<InputProps, 'onChange' | 'value' | 'onAbort'> {
  onChange?: (value: string) => void;
  onValueChanging?: (value: string) => void;
  value?: string;
  onChangeEnd?: (value: string) => void;
}

export const ControlInput = memo<ControlInputProps>(
  ({ value, onChange, onValueChanging, onChangeEnd, ...props }) => {
    const [input, setInput] = useState<string>(value || '');
    const inputRef = useRef<InputRef>(null);
    const isChineseInput = useRef(false);

    const isFocusing = useRef(false);

    const updateValue = useCallback(() => {
      onChange?.(input);
    }, [input]);

    useEffect(() => {
      if (typeof value !== 'undefined') setInput(value);
    }, [value]);

    return (
      <Input
        ref={inputRef}
        {...props}
        value={input}
        onCompositionStart={() => {
          isChineseInput.current = true;
        }}
        onCompositionEnd={() => {
          isChineseInput.current = false;
        }}
        onFocus={() => {
          isFocusing.current = true;
        }}
        onBlur={() => {
          isFocusing.current = false;
          onChangeEnd?.(input);
        }}
        onChange={(e) => {
          setInput(e.target.value);
          onValueChanging?.(e.target.value);
        }}
        onPressEnter={(e) => {
          if (!e.shiftKey && !isChineseInput.current) {
            e.preventDefault();
            updateValue();
            isFocusing.current = false;
            onChangeEnd?.(input);
          }
        }}
        suffix={
          value === input ? (
            <span />
          ) : (
            <ConfigProvider theme={{ token: { fontSize: 14 } }}>
              <Button
                type={'link'}
                size={'small'}
                onClick={() => {
                  setInput(value as string);
                }}
                style={{ padding: 0 }}
              >
                重置
              </Button>
              <Button
                type={'link'}
                size={'small'}
                style={{ padding: 0 }}
                onClick={() => {
                  updateValue();
                }}
              >
                保存 ↵
              </Button>
            </ConfigProvider>
          )
        }
      />
    );
  },
);
