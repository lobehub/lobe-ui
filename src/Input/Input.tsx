'use client';

import { Input as AntInput } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputProps } from './type';

const Input = memo<InputProps>(({ ref, variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntInput
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

Input.displayName = 'Input';

export default Input;
