'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cx } from 'antd-style';
import { CheckIcon, Minus } from 'lucide-react';
import { type CSSProperties, memo } from 'react';

import Text from '@/Text';

import { styles } from './style';
import type { CheckboxProps } from './type';

const Checkbox = memo<CheckboxProps>(
  ({
    size = 16,
    shape = 'square',
    backgroundColor,
    children,
    className,
    classNames,
    styles: customStyles,
    style,
    textProps,
    onChange,
    disabled,
    indeterminate,
    ...rest
  }) => {
    const boxStyle: CSSProperties = {
      borderRadius: shape === 'square' ? `max(4px, ${Math.round(size / 4)}px)` : '50%',
      height: size,
      width: size,
      ...(backgroundColor ? { '--lobe-checkbox-bg': backgroundColor } : {}),
      ...(children ? {} : style),
      ...customStyles?.checkbox,
    };

    const box = (
      <BaseCheckbox.Root
        disabled={disabled}
        indeterminate={indeterminate}
        style={boxStyle}
        className={cx(
          styles.root,
          children ? classNames?.checkbox : className,
          classNames?.checkbox,
        )}
        onCheckedChange={onChange}
        {...rest}
      >
        <BaseCheckbox.Indicator className={styles.indicator}>
          {indeterminate ? (
            <Minus
              size={size}
              strokeWidth={3}
              style={{ transform: `scale(${shape === 'square' ? 0.75 : 0.66})` }}
            />
          ) : (
            <CheckIcon
              size={size}
              strokeWidth={3}
              style={{ transform: `scale(${shape === 'square' ? 0.75 : 0.66})` }}
            />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );

    if (!children) return box;

    return (
      <label
        className={cx(styles.label, className, classNames?.wrapper)}
        style={{ gap: Math.floor(size / 2), ...style, ...customStyles?.wrapper }}
      >
        {box}
        <Text
          as={'span'}
          className={classNames?.text}
          style={customStyles?.text}
          {...textProps}
          type={disabled ? 'secondary' : textProps?.type}
        >
          {children}
        </Text>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
