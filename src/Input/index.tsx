'use client';

import { Input as AntInput, type InputProps as AntdInputProps, type InputRef } from 'antd';
import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';

import { useStyles } from './style';

export interface InputProps extends AntdInputProps {
  shadow?: boolean;
}

const Input = forwardRef<InputRef, InputProps>(
  ({ variant = 'filled', shadow, className, ...rest }, ref) => {
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
  },
);

Input.displayName = 'Input';

export default Input;
