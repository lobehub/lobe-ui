'use client';

import type { InputRef } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import { Flexbox } from '@/Flex';
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
        ref={ref}
        value={input}
        style={{
          width: '100%',
          ...style,
        }}
        suffix={
          value === input ? (
            <span />
          ) : (
            <Flexbox
              horizontal
              gap={2}
              style={{
                marginRight: -4,
                zIndex: 1,
              }}
            >
              <ActionIcon
                icon={RotateCcw}
                size="small"
                title={texts?.reset || 'Reset'}
                onClick={(e) => {
                  e.preventDefault();
                  setInput(value || '');
                }}
              />
              <ActionIcon
                icon={submitIcon || Save}
                size="small"
                title={texts?.submit || 'Submit'}
                variant={'filled'}
                onClick={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
              />
            </Flexbox>
          )
        }
        onFocus={onFocus}
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
        onPressEnter={(e) => {
          if (!e.shiftKey && !isChineseInput.current) {
            e.preventDefault();
            handleUpload();
            onPressEnter?.(e);
          }
        }}
        {...rest}
      />
    );
  },
);

ControlInput.displayName = 'ControlInput';

export default ControlInput;
