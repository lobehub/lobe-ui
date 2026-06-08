'use client';

import { Tag as AntTag } from 'antd';
import { cssVar, cx } from 'antd-style';
import { type FC, useMemo } from 'react';

import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from '@/Tag/utils';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { variants } from './styles';
import type { TagProps } from './type';

const Tag: FC<TagProps> = ({
  className,
  ref,
  shape = 'normal',
  size = 'middle',
  color,
  variant = 'filled',
  children,
  onClick,
  style,
  ...rest
}) => {
  const colors = useMemo(() => {
    const resolveActualColor = (colorValue?: string) => {
      if (!colorValue || !colorValue.startsWith('var(')) return colorValue;
      if (typeof window === 'undefined') return colorValue;

      const matched = colorValue.match(/var\((--[^,\s)]+)/);
      if (!matched?.[1]) return colorValue;

      const resolved = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(matched[1])
        .trim();

      return resolved || colorValue;
    };

    let textColor = cssVar.colorTextSecondary;
    let backgroundColor;
    let borderColor;
    const isBorderless = variant === 'borderless';
    const isFilled = variant === 'filled';
    const isSolid = variant === 'solid';
    const isPresetColor = color && presetColors.includes(color);
    const isPresetSystemColors = color && presetSystemColors.has(color);
    const isHexColor = color && color.startsWith('#');

    if (isPresetColor) {
      const solidBgColor = colorsPreset(color);
      textColor = isSolid
        ? safeReadableColor(resolveActualColor(solidBgColor) || solidBgColor)
        : colorsPreset(color, 'active');
      backgroundColor = isSolid
        ? solidBgColor
        : isBorderless
          ? 'transparent'
          : colorsPreset(color, 'fillTertiary');
      borderColor = isSolid
        ? solidBgColor
        : colorsPreset(color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isPresetSystemColors) {
      const solidBgColor = colorsPresetSystem(color);
      textColor = isSolid
        ? safeReadableColor(resolveActualColor(solidBgColor) || solidBgColor)
        : colorsPresetSystem(color);
      backgroundColor = isSolid
        ? solidBgColor
        : isBorderless
          ? 'transparent'
          : colorsPresetSystem(color, 'fillTertiary');
      borderColor = isSolid
        ? solidBgColor
        : colorsPresetSystem(color, isFilled ? 'fillQuaternary' : 'fillTertiary');
    }
    if (isHexColor) {
      textColor = isSolid ? safeReadableColor(color) : cssVar.colorBgLayout;
      backgroundColor = isSolid ? color : isBorderless ? 'transparent' : color;
      borderColor = isSolid ? color : borderColor;
    }

    return {
      backgroundColor,
      borderColor,
      textColor,
    };
  }, [color, variant]);

  return (
    <AntTag
      className={cx(variants({ shape, size, variant: variant as any }), className)}
      color={color}
      ref={ref}
      variant={variant === 'borderless' ? 'outlined' : variant === 'solid' ? 'filled' : variant}
      style={{
        background: colors?.backgroundColor,
        borderColor: colors?.borderColor,
        color: colors?.textColor,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </AntTag>
  );
};

Tag.displayName = 'Tag';

export default Tag;
