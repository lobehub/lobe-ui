'use client';

import {
  Select as AntSelect,
  type SelectProps as AntdSelectProps,
  type RefSelectProps,
} from 'antd';
import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import Icon, { type IconProps } from '@/Icon';

import { useStyles } from './style';

export interface SelectProps extends Omit<AntdSelectProps, 'suffixIcon'> {
  shadow?: boolean;
  suffixIcon?: IconProps['icon'];
  suffixIconProps?: Omit<IconProps, 'icon'>;
}

const Input = forwardRef<RefSelectProps, SelectProps>(
  ({ variant = 'filled', suffixIconProps, suffixIcon, shadow, className, ...rest }, ref) => {
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
      <AntSelect
        className={cx(variants({ shadow, variant }), className)}
        ref={ref}
        suffixIcon={
          <Icon
            icon={suffixIcon || ChevronDownIcon}
            size={'small'}
            {...suffixIconProps}
            style={{
              pointerEvents: 'none',
              ...suffixIconProps?.style,
            }}
          />
        }
        variant={variant}
        {...rest}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
