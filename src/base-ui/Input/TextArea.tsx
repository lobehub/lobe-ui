'use client';

import { Field } from '@base-ui/react/field';
import { cx, useThemeMode } from 'antd-style';
import { type CSSProperties, memo, useMemo } from 'react';

import { rootVariants, styles } from './style';
import type { TextAreaProps } from './type';

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
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

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
          className,
        )}
      >
        <Field.Control
          className={cx(styles.input, classNames?.input)}
          disabled={disabled}
          render={<textarea ref={ref} {...rest} />}
          style={customStyles?.input}
        />
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
