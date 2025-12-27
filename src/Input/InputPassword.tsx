'use client';

import { Input as AntInput } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntInput.Password
      className={cx(
        variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      ref={ref}
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
