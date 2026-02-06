'use client';

import { InputNumber as AntInputNumber } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { InputNumberProps } from './type';

const InputNumber = memo<InputNumberProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntInputNumber
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

InputNumber.displayName = 'InputNumber';

export default InputNumber;
