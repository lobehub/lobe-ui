'use client';

import clsx from 'clsx';
import { memo, useMemo } from 'react';

import { ButtonImpl } from '@/Button/Button';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { awesomeGradientButtonClasses } from './stable';
import { styles } from './style';
import type { GradientButtonProps } from './type';

const GradientButton = memo<GradientButtonProps>(
  ({ glow = true, children, className, size, disabled, style, ...rest }) => {
    const { isDarkMode } = useThemeMode();

    // Convert size prop to CSS variable for borderRadius
    const cssVariables = useMemo<Record<string, string>>(() => {
      if (!size || disabled) return {} as Record<string, string>;
      let borderRadius: string;
      switch (size) {
        case 'large': {
          borderRadius = cssVar.borderRadiusLG;
          break;
        }
        case 'small': {
          borderRadius = cssVar.borderRadiusSM;
          break;
        }
        default: {
          borderRadius = cssVar.borderRadius;
          break;
        }
      }
      return {
        '--gradient-button-border-radius': borderRadius,
      };
    }, [size, disabled]);

    return (
      <ButtonImpl
        className={clsx(awesomeGradientButtonClasses(), className)}
        disabled={disabled}
        size={size}
        type={disabled ? undefined : 'text'}
        xstyle={!disabled && [styles.button, isDarkMode ? styles.buttonDark : styles.buttonLight]}
        style={{
          ...cssVariables,
          ...style,
        }}
        {...rest}
      >
        {glow && <div {...styleProps(styles.glow, awesomeGradientButtonClasses('glow'))} />}
        {children}
      </ButtonImpl>
    );
  },
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
