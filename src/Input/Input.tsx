'use client';

import { Input as AntInput } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputProps } from './type';

const Input = memo<InputProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntInput
      ref={ref}
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      className={cx(
        variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

export default Input;
