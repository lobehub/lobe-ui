'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import clsx from 'clsx';
import { memo, useId, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import { A2uiField, a2uiFieldStyles } from '@/internal/a2ui/standardField';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';
import { useMergeRefs } from '@/utils/mergeRefs';

import { styles as a2uiInputStyles } from './a2uiStyle';
import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { inputMarker } from './marker.stylex';
import { isPressEnter } from './pressEnter';
import { inputClasses } from './stable';
import { inputRootStyles, styles } from './style';
import type { InputProps, InputVariant } from './type';

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
    label,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const isA2ui = mergedVariant === 'a2ui';
    const autoId = useId();
    const inputId = rest.id ?? (isA2ui && label != null ? autoId : undefined);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs([ref, inputRef]);
    const [filled, setFilled] = useState(() => hasText(value ?? defaultValue));
    const isFilled = value === undefined ? filled : hasText(value);
    const showClear = allowClear && isFilled && !disabled && !readOnly;

    const handleClear = useEventCallback(() => {
      clearNativeValue(inputRef.current);
      onClear?.();
    });

    const control = (
      <div
        data-disabled={disabled ? '' : undefined}
        data-variant={mergedVariant}
        {...toDataAttributes({ shadow, size })}
        {...styleProps(
          isA2ui
            ? [
                inputMarker,
                a2uiStyles.base,
                a2uiFieldStyles.base,
                a2uiFieldStyles.control,
                a2uiFieldStyles.controlFocusWithin,
                a2uiInputStyles.root,
              ]
            : inputRootStyles({ shadow, size, variant: mergedVariant as InputVariant }),
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
            [styles.input, isA2ui && a2uiFieldStyles.placeholder],
            clsx(inputClasses('input'), classNames?.input),
            customStyles?.input,
          )}
          id={inputId}
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

    if (!isA2ui || label == null) return control;
    return (
      <A2uiField htmlFor={inputId} label={label}>
        {control}
      </A2uiField>
    );
  },
);

Input.displayName = 'Input';

export default Object.assign(Input, { formBinding: { emptyValue: '' } as const });
