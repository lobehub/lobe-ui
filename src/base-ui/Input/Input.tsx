'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { rootVariants, styles } from './style';
import type { InputProps } from './type';

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
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

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
          disabled={disabled}
          ref={ref}
          style={customStyles?.input}
          {...rest}
        />
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
