'use client';

import './style.css';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles } from './style';
import type { TagProps } from './type';
import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from './utils';

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
  solid: stylish.variantFilledWithoutHover,
};

const roundSizeStyles = {
  large: styles.roundLarge,
  middle: styles.roundMiddle,
  small: styles.roundSmall,
};

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
        ref={ref}
        {...styleProps(
          [
            styles.root,
            variantStyles[variant],
            styles[size],
            shape === 'round' && [styles.round, roundSizeStyles[size]],
          ],
          clsx('lobe-tag', className, classNames?.root),
          {
            background: colors.backgroundColor,
            borderColor: colors.borderColor,
            color: colors.textColor,
            cursor: onClick ? 'pointer' : undefined,
            ...style,
            ...customStyles?.root,
          },
        )}
        onClick={onClick}
        {...rest}
      >
        {icon}
        {children}
        {closable && (
          <button
            aria-label="Close"
            {...styleProps(styles.close, classNames?.closeIcon, customStyles?.closeIcon)}
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
