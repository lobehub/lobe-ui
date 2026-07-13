'use client';

import { OTPField } from '@base-ui/react/otp-field';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { rootVariants, styles } from './style';
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
        className={cx(styles.otpRoot, className)}
        length={length}
        style={style}
        onValueChange={onChange}
        {...rest}
      >
        {Array.from({ length }, (_, index) => (
          <OTPField.Input
            key={index}
            style={customStyles?.input}
            className={cx(
              rootVariants({ shadow, size, variant: mergedVariant }),
              styles.otpCell,
              classNames?.input,
            )}
          />
        ))}
      </OTPField.Root>
    );
  },
);

InputOTP.displayName = 'InputOTP';

export default InputOTP;
