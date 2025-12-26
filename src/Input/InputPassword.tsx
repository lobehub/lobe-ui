'use client';

import { Input as AntInput } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(({ ref, variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntInput.Password
      className={cx(
        variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      ref={ref}
      variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
