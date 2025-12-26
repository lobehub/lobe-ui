'use client';

import { DatePicker as AntDatePicker } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import { DatePickerProps } from './type';

const DatePicker = memo<DatePickerProps>(({ variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntDatePicker
      className={cx(
        variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
