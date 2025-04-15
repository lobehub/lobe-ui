'use client';

import type { InputRef } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import Input, { type InputProps } from '@/Input';

export interface ControlInputProps extends Omit<InputProps, 'onChange' | 'value' | 'onAbort'> {
  onChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onValueChanging?: (value: string) => void;
  submitIcon?: ActionIconProps['icon'];
  texts?: {
    reset?: string;
    submit?: string;
  };
  value?: string;
}

const ControlInput = memo<ControlInputProps>(
  ({
    value,
    onChange,
    onValueChanging,
    onChangeEnd,
    onCompositionEnd,
    onCompositionStart,
    onPressEnter,
    onFocus,
    submitIcon,
    style,
    texts,
    ...rest
  }) => {
    const ref = useRef<InputRef>(null);
    const [input, setInput] = useState<string>(value || '');

    const isChineseInput = useRef(false);

    useEffect(() => {
      if (value !== undefined) setInput(value);
    }, [value]);

    const handleUpload = () => {
      onChange?.(input);
      ref?.current?.blur();
      onChangeEnd?.(input);
    };

    return (
      <Input
        autoFocus
        onChange={(e) => {
          setInput(e.target.value);
          onValueChanging?.(e.target.value);
        }}
        onCompositionEnd={(e) => {
          isChineseInput.current = false;
          onCompositionEnd?.(e);
        }}
        onCompositionStart={(e) => {
          isChineseInput.current = true;
          onCompositionStart?.(e);
        }}
        onFocus={onFocus}
        onPressEnter={(e) => {
          if (!e.shiftKey && !isChineseInput.current) {
            e.preventDefault();
            handleUpload();
            onPressEnter?.(e);
          }
        }}
        ref={ref}
        style={{
          width: '100%',
          ...style,
        }}
        suffix={
          value === input ? (
            <span />
          ) : (
            <Flexbox
              gap={2}
              horizontal
              style={{
                marginRight: -4,
                zIndex: 1,
              }}
            >
              <ActionIcon
                icon={RotateCcw}
                onClick={(e) => {
                  e.preventDefault();
                  setInput(value || '');
                }}
                size="small"
                title={texts?.reset || 'Reset'}
              />
              <ActionIcon
                icon={submitIcon || Save}
                onClick={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
                size="small"
                title={texts?.submit || 'Submit'}
                variant={'filled'}
              />
            </Flexbox>
          )
        }
        value={input}
        {...rest}
      />
    );
  },
);

ControlInput.displayName = 'ControlInput';

export default ControlInput;
