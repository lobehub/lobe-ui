import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd';
import { cva } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import Icon, { type IconProps } from '@/Icon';

import { useStyles } from './style';

export interface ButtonProps extends Omit<AntdButtonProps, 'icon'> {
  glass?: boolean;
  icon?: IconProps['icon'];
  iconProps?: Partial<Omit<IconProps, 'icon'>>;
  shadow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      icon,
      variant,
      glass,
      shadow,
      loading,
      className,
      type,
      color,
      danger,
      children,
      iconProps,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            glass: false,
            shadow: false,
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              dashed: null,
              text: null,
              link: null,
              normal: null,
              solid: null,
            },
            glass: {
              false: null,
              true: styles.glass,
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
      <AntdButton
        className={cx(variants({ glass, shadow, variant }), className)}
        color={danger ? 'danger' : type === 'primary' ? color : color || 'default'}
        danger={danger}
        icon={
          icon && <Icon icon={icon} {...iconProps} size={iconProps?.size || { size: '1.2em' }} />
        }
        loading={
          loading
            ? {
                icon: (
                  <Icon
                    icon={Loader2Icon}
                    {...iconProps}
                    size={iconProps?.size || { size: '1.2em' }}
                    spin
                  />
                ),
              }
            : false
        }
        ref={ref}
        type={type}
        variant={variant || (type === 'primary' ? undefined : 'filled')}
        {...rest}
      >
        {children}
      </AntdButton>
    );
  },
);

export default Button;
