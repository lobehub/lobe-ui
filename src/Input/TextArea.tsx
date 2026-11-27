'use client';

import { Field } from '@base-ui/react/field';
import clsx from 'clsx';
import { type CSSProperties, memo, useId, useMemo, useRef, useState } from 'react';

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
import { textAreaClasses } from './stable';
import { inputRootStyles, styles } from './style';
import type { InputVariant, TextAreaProps } from './type';

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
    label,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const isA2ui = mergedVariant === 'a2ui';
    const autoId = useId();
    const controlId = rest.id ?? (isA2ui && label != null ? autoId : undefined);
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

    const control = (
      <div
        data-disabled={disabled ? '' : undefined}
        data-variant={mergedVariant}
        {...toDataAttributes({ shadow })}
        {...styleProps(
          [
            ...(isA2ui
              ? [
                  inputMarker,
                  a2uiStyles.base,
                  a2uiFieldStyles.base,
                  a2uiFieldStyles.control,
                  a2uiFieldStyles.controlFocusWithin,
                  a2uiInputStyles.root,
                  a2uiInputStyles.textarea,
                ]
              : [
                  ...inputRootStyles({ shadow, variant: mergedVariant as InputVariant }),
                  styles.textarea,
                ]),
            showCount && styles.textareaWithCount,
          ],
          clsx(textAreaClasses(), className),
          { ...cssVariables, ...style },
        )}
      >
        <Field.Control
          disabled={disabled}
          {...styleProps(
            [
              styles.input,
              styles.textareaControl,
              isA2ui && a2uiFieldStyles.placeholder,
              isA2ui && a2uiInputStyles.textareaControl,
              autoSize && styles.textareaAutoSize,
              resize && styles.textareaResize,
              isA2ui && autoSize && a2uiInputStyles.textareaControlFixed,
            ],
            clsx(textAreaClasses('input'), classNames?.input),
            customStyles?.input,
          )}
          render={
            <textarea
              defaultValue={defaultValue}
              id={controlId}
              maxLength={maxLength}
              readOnly={readOnly}
              ref={mergedRef}
              rows={isA2ui && rest.rows === undefined && !autoSize ? 3 : undefined}
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
            className={textAreaClasses('clear')}
            xstyle={styles.textareaClear}
            onClear={() => {
              clearNativeValue(textareaRef.current);
              onClear?.();
            }}
          />
        )}
        {showCount && (
          <span
            data-over={over ? '' : undefined}
            {...styleProps(styles.count, textAreaClasses('count'))}
          >
            {maxLength === undefined ? length : `${length} / ${maxLength}`}
          </span>
        )}
      </div>
    );

    if (!isA2ui || label == null) return control;
    return (
      <A2uiField htmlFor={controlId} label={label}>
        {control}
      </A2uiField>
    );
  },
);

TextArea.displayName = 'TextArea';

export default Object.assign(TextArea, { formBinding: { emptyValue: '' } as const });
