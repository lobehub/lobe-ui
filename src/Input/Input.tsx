'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { memo, useRef, useState } from 'react';
import { useMergeRefs } from 'react-merge-refs';

import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { inputRootStyles, styles } from './style';
import type { InputProps } from './type';

const hasText = (value: unknown) =>
  value !== undefined && value !== null && String(value).length > 0;

const Input = memo<InputProps>(
  ({
    ref,
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    size = 'middle',
    prefix,
    suffix,
    disabled,
    readOnly,
    allowClear,
    onClear,
    onPressEnter,
    onKeyDown,
    onChange,
    value,
    defaultValue,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs([ref, inputRef]);
    const [filled, setFilled] = useState(() => hasText(value ?? defaultValue));
    const isFilled = value === undefined ? filled : hasText(value);
    const showClear = allowClear && isFilled && !disabled && !readOnly;

    return (
      <div
        data-disabled={disabled ? '' : undefined}
        data-variant={mergedVariant}
        {...styleProps(inputRootStyles({ shadow, size, variant: mergedVariant }), className, style)}
      >
        {prefix && (
          <span {...styleProps(styles.slot, classNames?.prefix, customStyles?.prefix)}>
            {prefix}
          </span>
        )}
        <BaseInput
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          ref={mergedRef}
          value={value}
          {...styleProps(styles.input, classNames?.input, customStyles?.input)}
          onChange={(event) => {
            setFilled(event.currentTarget.value.length > 0);
            onChange?.(event);
          }}
          onKeyDown={(event) => {
            if (isPressEnter(event)) onPressEnter?.(event);
            onKeyDown?.(event);
          }}
          {...rest}
        />
        {showClear && (
          <ClearButton
            onClear={() => {
              clearNativeValue(inputRef.current);
              onClear?.();
            }}
          />
        )}
        {suffix && (
          <span {...styleProps(styles.slot, classNames?.suffix, customStyles?.suffix)}>
            {suffix}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Object.assign(Input, { formBinding: { emptyValue: '' } as const });
