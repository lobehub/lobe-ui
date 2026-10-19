'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import clsx from 'clsx';
import { memo, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';
import { useMergeRefs } from '@/utils/mergeRefs';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { inputClasses } from './stable';
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

    const handleClear = useEventCallback(() => {
      clearNativeValue(inputRef.current);
      onClear?.();
    });

    return (
      <div
        data-disabled={disabled ? '' : undefined}
        data-variant={mergedVariant}
        {...toDataAttributes({ shadow, size })}
        {...styleProps(
          inputRootStyles({ shadow, size, variant: mergedVariant }),
          clsx(inputClasses(), className),
          style,
        )}
      >
        {prefix && (
          <span
            {...styleProps(
              styles.slot,
              clsx(inputClasses('prefix'), classNames?.prefix),
              customStyles?.prefix,
            )}
          >
            {prefix}
          </span>
        )}
        <BaseInput
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          ref={mergedRef}
          value={value}
          {...styleProps(
            styles.input,
            clsx(inputClasses('input'), classNames?.input),
            customStyles?.input,
          )}
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
        {showClear && <ClearButton className={inputClasses('clear')} onClear={handleClear} />}
        {suffix && (
          <span
            {...styleProps(
              styles.slot,
              clsx(inputClasses('suffix'), classNames?.suffix),
              customStyles?.suffix,
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Object.assign(Input, { formBinding: { emptyValue: '' } as const });
