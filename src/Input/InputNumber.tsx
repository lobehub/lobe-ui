'use client';

import { InputNumber as AntInputNumber, type InputNumberProps as AntdInputNumberProps } from 'antd';
import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';

import { useStyles } from './style';

export interface InputNumberProps extends AntdInputNumberProps {
  shadow?: boolean;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
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
      <AntInputNumber
        className={cx(variants({ shadow, variant }), className)}
        ref={ref}
        variant={variant}
        {...rest}
      />
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
