'use client';

import { Input as AntInput } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variantsOPT } from './style';
import type { InputOPTProps } from './type';

const InputOPT = memo<InputOPTProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntInput.OTP
      ref={ref}
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      className={cx(
        variantsOPT({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      {...rest}
    />
  );
});

InputOPT.displayName = 'InputOPT';

export default InputOPT;
