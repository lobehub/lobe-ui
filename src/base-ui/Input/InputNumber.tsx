'use client';

import { NumberField } from '@base-ui/react/number-field';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
import type { InputNumberProps } from './type';

const InputNumber = memo<InputNumberProps>(
  ({
    ref,
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    size = 'middle',
    controls = true,
    changeOnWheel,
    onChange,
    placeholder,
    format,
    precision,
    prefix,
    suffix,
    onPressEnter,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const mergedFormat =
      precision === undefined
        ? format
        : { ...format, maximumFractionDigits: precision, minimumFractionDigits: precision };

    return (
      <NumberField.Root
        allowWheelScrub={changeOnWheel}
        className={cx(rootVariants({ shadow, size, variant: mergedVariant }), className)}
        format={mergedFormat}
        style={style}
        onValueChange={onChange}
        {...rest}
      >
        {prefix && <span className={styles.slot}>{prefix}</span>}
        <NumberField.Input
          className={cx(styles.input, styles.numberInput, classNames?.input)}
          placeholder={placeholder}
          ref={ref}
          style={customStyles?.input}
          onKeyDown={(event) => {
            if (isPressEnter(event)) onPressEnter?.(event);
          }}
        />
        {suffix && <span className={styles.slot}>{suffix}</span>}
        {controls && (
          <div className={styles.numberControls}>
            <NumberField.Increment className={styles.numberControl}>
              <Icon icon={ChevronUp} size={12} />
            </NumberField.Increment>
            <NumberField.Decrement className={styles.numberControl}>
              <Icon icon={ChevronDown} size={12} />
            </NumberField.Decrement>
          </div>
        )}
      </NumberField.Root>
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
