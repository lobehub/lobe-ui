'use client';

import { RotateCcw, Save } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import { useEventCallback } from '@/hooks/useEventCallback';
import { Input, type InputProps } from '@/Input';

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
    const ref = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState<string>(value || '');

    const isChineseInput = useRef(false);

    useEffect(() => {
      if (value !== undefined) setInput(value);
    }, [value]);

    const handleUpload = useEventCallback(() => {
      onChange?.(input);
      ref?.current?.blur();
      onChangeEnd?.(input);
    });

    const handleReset = useEventCallback(() => setInput(value || ''));

    const dirty = value !== input;
    const resetText = texts?.reset || 'Reset';
    const submitText = texts?.submit || 'Submit';

    const suffix = useMemo(
      () =>
        dirty ? (
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
              title={resetText}
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }}
            />
            <ActionIcon
              icon={submitIcon || Save}
              size="small"
              title={submitText}
              variant={'filled'}
              onClick={(e) => {
                e.preventDefault();
                handleUpload();
              }}
            />
          </Flexbox>
        ) : (
          <span />
        ),
      [dirty, handleReset, handleUpload, resetText, submitIcon, submitText],
    );

    return (
      <Input
        autoFocus
        ref={ref}
        suffix={suffix}
        value={input}
        style={{
          width: '100%',
          ...style,
        }}
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
