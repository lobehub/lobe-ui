'use client';

import { NumberField } from '@base-ui/react/number-field';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

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
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

    return (
      <NumberField.Root
        allowWheelScrub={changeOnWheel}
        className={cx(rootVariants({ shadow, size, variant: mergedVariant }), className)}
        style={style}
        onValueChange={onChange}
        {...rest}
      >
        <NumberField.Input
          className={cx(styles.input, styles.numberInput, classNames?.input)}
          placeholder={placeholder}
          ref={ref}
          style={customStyles?.input}
        />
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
