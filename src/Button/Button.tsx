'use client';

import { Button as AntdButton } from 'antd';
import { cx, useThemeMode } from 'antd-style';
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
  const { isDarkMode } = useThemeMode();

  const defaultVariant = type ? undefined : variant || (isDarkMode ? 'filled' : 'outlined');

  return (
    <AntdButton
      color={color || (defaultVariant === 'filled' ? 'default' : undefined)}
      danger={danger}
      ref={ref}
      type={type}
      variant={defaultVariant}
      className={cx(
        variants({
          glass,
          shadow,
        }),
        className,
      )}
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
                  spin
                  size={iconProps?.size || { size: '1.2em' }}
                />
              ),
            }
          : false
      }
      {...rest}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
