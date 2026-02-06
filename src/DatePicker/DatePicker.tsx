'use client';

import { DatePicker as AntDatePicker } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { DatePickerProps } from './type';

const DatePicker = memo<DatePickerProps>(({ variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntDatePicker
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      className={cx(
        variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      {...rest}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
