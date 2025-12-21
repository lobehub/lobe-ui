'use client';

import { Tag as AntTag } from 'antd';
import { cva } from 'class-variance-authority';
import { type FC, useMemo } from 'react';

import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from '@/Tag/utils';

import { useStyles } from './styles';
import type { TagProps } from './type';

const Tag: FC<TagProps> = ({
  className,
  ref,
  size = 'middle',
  color,
  variant = 'filled',
  children,
  onClick,
  style,
  ...rest
}) => {
  const { styles, cx, theme } = useStyles();

  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          size: 'middle',
          variant: 'filled',
        },
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        variants: {
          variant: {
            filled: styles.filled,
            outlined: styles.outlined,
            borderless: styles.borderless,
          },
          size: {
            small: styles.small,
            middle: null,
            large: styles.large,
          },
        },
        /* eslint-enable sort-keys-fix/sort-keys-fix */
      }),
    [styles],
  );

  const colors = useMemo(() => {
    let textColor = theme.colorTextSecondary;
    let backgroundColor;
    let borderColor;
    const isBorderless = variant === 'borderless';
    const isFilled = variant === 'filled';
    const isPresetColor = color && presetColors.includes(color);
    const isPresetSystemColors = color && presetSystemColors.has(color);
    const isHexColor = color && color.startsWith('#');

    if (isPresetColor) {
      textColor = colorsPreset(theme, color);
      backgroundColor = isBorderless ? 'transparent' : colorsPreset(theme, color, 'fillTertiary');
      borderColor = colorsPreset(theme, color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isPresetSystemColors) {
      textColor = colorsPresetSystem(theme, color);
      backgroundColor = isBorderless
        ? 'transparent'
        : colorsPresetSystem(theme, color, 'fillTertiary');
      borderColor = colorsPresetSystem(theme, color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isHexColor) {
      textColor = theme.colorBgLayout;
      backgroundColor = isBorderless ? 'transparent' : color;
    }

    return {
      backgroundColor,
      borderColor,
      textColor,
    };
  }, [color, theme, variant]);

  return (
    <AntTag
      className={cx(variants({ size, variant: variant as any }), className)}
      color={color}
      onClick={onClick}
      ref={ref}
      style={{
        background: colors?.backgroundColor,
        borderColor: colors?.borderColor,
        color: colors?.textColor,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      variant={variant === 'borderless' ? 'outlined' : variant}
      {...rest}
    >
      {children}
    </AntTag>
  );
};

Tag.displayName = 'Tag';

export default Tag;
