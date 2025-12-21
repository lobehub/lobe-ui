'use client';

import { Button as AntdButton } from 'antd';
import { cva } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import { type FC, isValidElement, useMemo } from 'react';

import Icon from '@/Icon';

import { useStyles } from './style';
import type { ButtonProps } from './type';

const Button: FC<ButtonProps> = ({
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
  ref,
  ...rest
}) => {
  const { styles, cx, theme } = useStyles();

  const defaultVariant = type ? undefined : variant || (theme.isDarkMode ? 'filled' : 'outlined');

  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          glass: false,
          shadow: false,
        },
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        variants: {
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
      className={cx(
        variants({
          glass,
          shadow,
        }),
        className,
      )}
      color={color || (defaultVariant === 'filled' ? 'default' : undefined)}
      danger={danger}
      icon={
        icon &&
        (isValidElement(icon) ? (
          icon
        ) : (
          <Icon icon={icon} {...iconProps} size={iconProps?.size || { size: '1.2em' }} />
        ))
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
      variant={defaultVariant}
      {...rest}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
