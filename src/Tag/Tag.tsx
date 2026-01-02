'use client';

import { Tag as AntTag } from 'antd';
import { cssVar, cx } from 'antd-style';
import { type FC, useMemo } from 'react';

import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from '@/Tag/utils';

import { variants } from './styles';
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
  const colors = useMemo(() => {
    let textColor = cssVar.colorTextSecondary;
    let backgroundColor;
    let borderColor;
    const isBorderless = variant === 'borderless';
    const isFilled = variant === 'filled';
    const isPresetColor = color && presetColors.includes(color);
    const isPresetSystemColors = color && presetSystemColors.has(color);
    const isHexColor = color && color.startsWith('#');

    if (isPresetColor) {
      textColor = colorsPreset(color);
      backgroundColor = isBorderless ? 'transparent' : colorsPreset(color, 'fillTertiary');
      borderColor = colorsPreset(color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isPresetSystemColors) {
      textColor = colorsPresetSystem(color);
      backgroundColor = isBorderless ? 'transparent' : colorsPresetSystem(color, 'fillTertiary');
      borderColor = colorsPresetSystem(color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isHexColor) {
      textColor = cssVar.colorBgLayout;
      backgroundColor = isBorderless ? 'transparent' : color;
    }

    return {
      backgroundColor,
      borderColor,
      textColor,
    };
  }, [color, variant]);

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
