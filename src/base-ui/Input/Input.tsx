'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { cx, useThemeMode } from 'antd-style';
import { memo, useRef, useState } from 'react';
import { useMergeRefs } from 'react-merge-refs';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
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
        className={cx(rootVariants({ shadow, size, variant: mergedVariant }), className)}
        data-disabled={disabled ? '' : undefined}
        style={style}
      >
        {prefix && (
          <span className={cx(styles.slot, classNames?.prefix)} style={customStyles?.prefix}>
            {prefix}
          </span>
        )}
        <BaseInput
          className={cx(styles.input, classNames?.input)}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          ref={mergedRef}
          style={customStyles?.input}
          value={value}
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
          <span className={cx(styles.slot, classNames?.suffix)} style={customStyles?.suffix}>
            {suffix}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
