'use client';

import { NumberField } from '@base-ui/react/number-field';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { isPressEnter } from './pressEnter';
import { inputRootStyles, styles } from './style';
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
    const controlProps = stylex.props(
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
        format={mergedFormat}
        onValueChange={onChange}
        {...rest}
        {...styleProps(inputRootStyles({ shadow, size, variant: mergedVariant }), className, style)}
      >
        {prefix && <span {...stylex.props(styles.slot)}>{prefix}</span>}
        <NumberField.Input
          placeholder={placeholder}
          ref={ref}
          onKeyDown={(event) => {
            if (isPressEnter(event)) onPressEnter?.(event);
          }}
          {...styleProps(
            [styles.input, styles.numberInput],
            classNames?.input,
            customStyles?.input,
          )}
        />
        {suffix && <span {...stylex.props(styles.slot)}>{suffix}</span>}
        {controls && (
          <div
            {...stylex.props(styles.numberControls, size === 'small' && styles.numberControlsSmall)}
          >
            <NumberField.Increment {...controlProps}>
              <Icon icon={ChevronUp} size={controlIconSize[size]} />
            </NumberField.Increment>
            <NumberField.Decrement {...controlProps}>
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
