'use client';

import { OTPField } from '@base-ui/react/otp-field';
import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { inputOTPClasses } from './stable';
import { inputRootStyles, styles } from './style';
import type { InputOTPProps } from './type';

const InputOTP = memo<InputOTPProps>(
  ({
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    size = 'middle',
    length = 6,
    onChange,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

    return (
      <OTPField.Root
        length={length}
        onValueChange={onChange}
        {...toDataAttributes({ shadow, size, variant: mergedVariant })}
        {...rest}
        {...styleProps(styles.otpRoot, clsx(inputOTPClasses(), className), style)}
      >
        {Array.from({ length }, (_, index) => (
          <OTPField.Input
            key={index}
            {...styleProps(
              [...inputRootStyles({ shadow, size, variant: mergedVariant }), styles.otpCell],
              clsx(inputOTPClasses('input'), classNames?.input),
              customStyles?.input,
            )}
          />
        ))}
      </OTPField.Root>
    );
  },
);

InputOTP.displayName = 'InputOTP';

export default InputOTP;
