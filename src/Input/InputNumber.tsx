'use client';

import { InputNumber as AntInputNumber } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputNumberProps } from './type';

const InputNumber = memo<InputNumberProps>(({ ref, variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntInputNumber
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

InputNumber.displayName = 'InputNumber';

export default InputNumber;
