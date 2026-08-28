'use client';

import { cssVar, cx } from 'antd-style';
import { X } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles, variants } from './style';
import type { TagProps } from './type';
import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from './utils';

const Tag = memo<TagProps>(
  ({
    children,
    className,
    classNames,
    closable,
    closeIcon,
    color,
    icon,
    onClick,
    onClose,
    ref,
    shape = 'normal',
    size = 'middle',
    style,
    styles: customStyles,
    variant = 'filled',
    ...rest
  }) => {
    const [visible, setVisible] = useState(true);

    const colors = useMemo(() => {
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
        textColor = isSolid ? safeReadableColor(solidBgColor) : colorsPreset(color, 'active');
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
        textColor = isSolid ? safeReadableColor(solidBgColor) : colorsPresetSystem(color);
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
        textColor = isSolid
          ? safeReadableColor(color)
          : isBorderless
            ? color
            : cssVar.colorBgLayout;
        backgroundColor = isSolid ? color : isBorderless ? 'transparent' : color;
        borderColor = isSolid ? color : borderColor;
      }

      return {
        backgroundColor,
        borderColor,
        textColor,
      };
    }, [color, variant]);

    if (!visible) return null;

    return (
      <span
        className={cx(variants({ shape, size, variant }), className, classNames?.root)}
        ref={ref}
        style={{
          background: colors.backgroundColor,
          borderColor: colors.borderColor,
          color: colors.textColor,
          cursor: onClick ? 'pointer' : undefined,
          ...style,
          ...customStyles?.root,
        }}
        onClick={onClick}
        {...rest}
      >
        {icon}
        {children}
        {closable && (
          <button
            aria-label="Close"
            className={cx(styles.close, classNames?.closeIcon)}
            style={customStyles?.closeIcon}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.(e);
              setVisible(false);
            }}
          >
            {closeIcon ?? <X size={10} />}
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';

export default Tag;
