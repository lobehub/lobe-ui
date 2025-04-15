'use client';

import { Input as AntInput } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { InputProps } from './type';

const Input = memo<InputProps>(({ ref, variant = 'outlined', shadow, className, ...rest }) => {
  const { styles, cx } = useStyles();

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
    <AntInput
      className={cx(variants({ shadow, variant }), className)}
      ref={ref}
      variant={variant}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

export default Input;
