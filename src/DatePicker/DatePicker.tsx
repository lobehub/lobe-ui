'use client';

import { DatePicker as AntDatePicker } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import { DatePickerProps } from './type';

const DatePicker = memo<DatePickerProps>(({ variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntDatePicker
      className={cx(
        variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
