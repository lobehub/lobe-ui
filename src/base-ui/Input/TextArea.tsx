'use client';

import { Field } from '@base-ui/react/field';
import { cx, useThemeMode } from 'antd-style';
import { type CSSProperties, memo, useMemo, useRef, useState } from 'react';
import { useMergeRefs } from 'react-merge-refs';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
import type { TextAreaProps } from './type';

const textLength = (value: unknown) =>
  value === undefined || value === null ? 0 : Array.from(String(value)).length;

const TextArea = memo<TextAreaProps>(
  ({
    ref,
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    autoSize,
    resize = false,
    disabled,
    readOnly,
    allowClear,
    onClear,
    onPressEnter,
    onKeyDown,
    onChange,
    showCount,
    maxLength,
    value,
    defaultValue,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergeRefs([ref, textareaRef]);
    const [innerLength, setInnerLength] = useState(() => textLength(value ?? defaultValue));
    const length = value === undefined ? innerLength : textLength(value);
    const showClear = allowClear && length > 0 && !disabled && !readOnly;
    const over = maxLength !== undefined && length > maxLength;

    const cssVariables = useMemo<CSSProperties>(() => {
      if (typeof autoSize !== 'object') return {};
      return {
        '--textarea-max-height': autoSize.maxRows ? `calc(1.5em * ${autoSize.maxRows})` : undefined,
        '--textarea-min-rows': autoSize.minRows,
      } as CSSProperties;
    }, [autoSize]);

    return (
      <div
        data-disabled={disabled ? '' : undefined}
        style={{ ...cssVariables, ...style }}
        className={cx(
          rootVariants({ shadow, variant: mergedVariant }),
          styles.textarea,
          autoSize && styles.textareaAutoSize,
          resize && styles.textareaResize,
          showCount && styles.textareaWithCount,
          className,
        )}
      >
        <Field.Control
          className={cx(styles.input, classNames?.input)}
          disabled={disabled}
          style={customStyles?.input}
          render={
            <textarea
              defaultValue={defaultValue}
              maxLength={maxLength}
              readOnly={readOnly}
              ref={mergedRef}
              value={value}
              onChange={(event) => {
                setInnerLength(textLength(event.currentTarget.value));
                onChange?.(event);
              }}
              onKeyDown={(event) => {
                if (isPressEnter(event)) onPressEnter?.(event);
                onKeyDown?.(event);
              }}
              {...rest}
            />
          }
        />
        {showClear && (
          <ClearButton
            className={styles.textareaClear}
            onClear={() => {
              clearNativeValue(textareaRef.current);
              onClear?.();
            }}
          />
        )}
        {showCount && (
          <span className={styles.count} data-over={over ? '' : undefined}>
            {maxLength === undefined ? length : `${length} / ${maxLength}`}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default Object.assign(TextArea, { formBinding: { emptyValue: '' } as const });
