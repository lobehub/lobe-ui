'use client';

import { Input as AntInput } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variantsOPT } from './style';
import type { InputOPTProps } from './type';

const InputOPT = memo<InputOPTProps>(({ ref, variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntInput.OTP
      className={cx(
        variantsOPT({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      ref={ref}
      variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

InputOPT.displayName = 'InputOPT';

export default InputOPT;
