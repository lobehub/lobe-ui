'use client';

import { Input as AntInput } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { InputOPTProps } from './type';

const InputOPT = memo<InputOPTProps>(({ ref, variant, shadow, className, ...rest }) => {
  const { styles, cx, theme } = useStyles();

  const variants = useMemo(
    () =>
      cva(styles.rootOPT, {
        defaultVariants: {
          shadow: false,
          variant: 'filled',
        },
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        variants: {
          variant: {
            filled: styles.filledOPT,
            outlined: styles.outlinedOPT,
            borderless: styles.borderlessOPT,
            underlined: null,
          },
          shadow: {
            false: null,
            true: styles.shadowOPT,
          },
        },
        /* eslint-enable sort-keys-fix/sort-keys-fix */
      }),
    [styles],
  );

  return (
    <AntInput.OTP
      className={cx(
        variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      ref={ref}
      variant={variant}
      {...rest}
    />
  );
});

InputOPT.displayName = 'InputOPT';

export default InputOPT;
