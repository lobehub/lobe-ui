'use client';

import { Button as AntdButton } from 'antd';
import { cx, useTheme } from 'antd-style';
import { Loader2Icon } from 'lucide-react';
import { type FC, isValidElement } from 'react';

import Icon from '@/Icon';

import { variants } from './style';
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
  const theme = useTheme();

  const defaultVariant = type ? undefined : variant || (theme.isDarkMode ? 'filled' : 'outlined');

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
