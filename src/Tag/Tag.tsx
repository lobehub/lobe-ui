'use client';

import './style.css';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { a2uiStyles, a2uiToneSoft } from '@/internal/a2ui/styles';
import { toA2uiTone } from '@/internal/a2ui/utils';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { toDataAttributes } from '@/utils/bem';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { tagClasses } from './stable';
import { styles } from './style';
import type { TagProps } from './type';
import { colorsPreset, colorsPresetSystem, presetColors, presetSystemColors } from './utils';

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
  solid: stylish.variantFilledWithoutHover,
  a2ui: null,
};

const a2uiSizeStyles = {
  large: styles.a2uiLarge,
  middle: styles.a2uiMiddle,
  small: styles.a2uiSmall,
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

    const isA2ui = variant === 'a2ui';

    const colors = useMemo(() => {
      if (variant === 'a2ui') {
        // A hex colour tints like a tone: 13% wash, 24% hairline, the colour as text.
        if (!color?.startsWith('#')) return {};
        return {
          backgroundColor: `color-mix(in oklch, ${color} 13%, transparent)`,
          borderColor: `color-mix(in oklch, ${color} 24%, transparent)`,
          textColor: color,
        };
      }
      let textColor: string | undefined;
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
            isA2ui
              ? [
                  a2uiStyles.base,
                  styles.a2ui,
                  a2uiToneSoft[toA2uiTone(color)],
                  a2uiSizeStyles[size],
                  shape === 'round' && styles.a2uiRound,
                ]
              : [
                  styles[size],
                  shape === 'round' && [styles.round, roundSizeStyles[size]],
                  !colors.textColor && styles.defaultColor,
                ],
            !!onClick && styles.clickable,
          ],
          clsx('lobe-tag', className, classNames?.root),
          {
            background: colors.backgroundColor,
            borderColor: colors.borderColor,
            color: colors.textColor,
            ...style,
            ...customStyles?.root,
          },
        )}
        onClick={onClick}
        {...toDataAttributes({ color, shape, size, variant })}
        {...rest}
      >
        {icon}
        {isA2ui && children != null ? (
          <span {...styleProps(styles.a2uiText)}>{children}</span>
        ) : (
          children
        )}
        {closable && (
          <button
            aria-label="Close"
            {...styleProps(
              styles.close,
              clsx(tagClasses('close'), classNames?.closeIcon),
              customStyles?.closeIcon,
            )}
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
