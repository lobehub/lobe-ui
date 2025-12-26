'use client';

import { cx, useTheme } from 'antd-style';
import { memo, useMemo } from 'react';

import Button from '@/Button';

import { styles } from './style';
import type { GradientButtonProps } from './type';

const GradientButton = memo<GradientButtonProps>(
  ({ glow = true, children, className, size, disabled, style, ...rest }) => {
    const theme = useTheme();

    // Convert size prop to CSS variable for borderRadius
    const cssVariables = useMemo<Record<string, string>>(() => {
      if (!size || disabled) return {} as Record<string, string>;
      let borderRadius: string;
      switch (size) {
        case 'large': {
          borderRadius = `${theme.borderRadiusLG}px`;
          break;
        }
        case 'small': {
          borderRadius = `${theme.borderRadiusSM}px`;
          break;
        }
        default: {
          borderRadius = `${theme.borderRadius}px`;
          break;
        }
      }
      return {
        '--gradient-button-border-radius': borderRadius,
      };
    }, [size, disabled, theme]);

    return (
      <Button
        className={cx(
          !disabled && (theme.isDarkMode ? styles.buttonDark : styles.buttonLight),
          className,
        )}
        disabled={disabled}
        size={size}
        style={{
          ...cssVariables,
          ...style,
        }}
        variant={disabled ? undefined : 'text'}
        {...rest}
      >
        {glow && <div className={styles.glow} />}
        {children}
      </Button>
    );
  },
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
