'use client';

import { DatePicker as AntDatePicker } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import { DatePickerProps } from './type';

const DatePicker = memo<DatePickerProps>(({ variant, shadow, className, ...rest }) => {
  const { styles, cx, theme } = useStyles();

  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          shadow: false,
          variant: 'filled',
        },
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        variants: {
          variant: {
            filled: styles.filled,
            outlined: styles.outlined,
            borderless: styles.borderless,
            underlined: null,
          },
          shadow: {
            false: null,
            true: styles.shadow,
          },
        },
        /* eslint-enable sort-keys-fix/sort-keys-fix */
      }),
    [styles],
  );

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
