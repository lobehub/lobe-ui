'use client';

import { NumberField } from '@base-ui/react/number-field';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
import type { InputNumberProps } from './type';

const controlIconSize = { large: 13, middle: 12, small: 10 } as const;

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
    const controlClassName = cx(
      styles.numberControl,
      size === 'small' && styles.numberControlSmall,
      size === 'large' && styles.numberControlLarge,
    );
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
          <div
            className={cx(styles.numberControls, size === 'small' && styles.numberControlsSmall)}
          >
            <NumberField.Increment className={controlClassName}>
              <Icon icon={ChevronUp} size={controlIconSize[size]} />
            </NumberField.Increment>
            <NumberField.Decrement className={controlClassName}>
              <Icon icon={ChevronDown} size={controlIconSize[size]} />
            </NumberField.Decrement>
          </div>
        )}
      </NumberField.Root>
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default Object.assign(InputNumber, { formBinding: { emptyValue: null } as const });
