'use client';

import { InputNumber as AntInputNumber } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { InputNumberProps } from './type';

const InputNumber = memo<InputNumberProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { styles, cx, theme } = useStyles();

  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          shadow: false,
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
