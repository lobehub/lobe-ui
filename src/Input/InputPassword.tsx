'use client';

import { Input as AntInput } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(({ ref, variant, shadow, className, ...rest }) => {
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
    <AntInput.Password
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

InputPassword.displayName = 'InputPassword';

export default InputPassword;
