'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

import { inputRootStyles } from '@/Input/style';
import type { InputSize } from '@/Input/type';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { colorPickerClasses } from './stable';
import { triggerStyles } from './style';
import Swatch from './Swatch';
import type { ColorPickerTrigger } from './type';

const SWATCH_TILE: Record<InputSize, number> = { large: 32, middle: 28, small: 24 };
const SWATCH_FIELD: Record<InputSize, number> = { large: 20, middle: 16, small: 14 };
const SWATCH_CHIP: Record<InputSize, number> = { large: 26, middle: 20, small: 16 };

const fieldSize = {
  large: triggerStyles.fieldLarge,
  middle: triggerStyles.fieldMiddle,
  small: triggerStyles.fieldSmall,
};
const tileSize = {
  large: triggerStyles.tileLarge,
  middle: triggerStyles.tileMiddle,
  small: triggerStyles.tileSmall,
};

const chipSize = {
  large: triggerStyles.chipLarge,
  middle: triggerStyles.chipMiddle,
  small: triggerStyles.chipSmall,
};

export interface ColorTriggerProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  alpha?: number;
  emptyLabel: string;
  hex: string;
  label: string;
  size: InputSize;
  variant: ColorPickerTrigger;
}

const ColorTrigger = ({
  alpha,
  className,
  emptyLabel,
  hex,
  label,
  size,
  style,
  variant,
  ...rest
}: ColorTriggerProps) => {
  const { isDarkMode } = useThemeMode();
  const empty = !hex;
  const common = {
    'aria-label': label,
    'type': 'button' as const,
    ...toDataAttributes({ size, trigger: variant }),
    ...rest,
  };
  const rootClassName = clsx(colorPickerClasses(), className);
  const swatchClassName = colorPickerClasses('swatch');

  if (variant === 'swatch') {
    const tile = SWATCH_TILE[size];
    return (
      <button
        {...common}
        {...styleProps(
          [focusRing.info, triggerStyles.swatch, tileSize[size]],
          rootClassName,
          style,
        )}
      >
        <Swatch className={swatchClassName} color={hex} radius={8} size={tile} />
      </button>
    );
  }

  const text = empty ? (
    <span {...styleProps(triggerStyles.empty, colorPickerClasses('text'))}>{emptyLabel}</span>
  ) : (
    <>
      <span {...styleProps(triggerStyles.text, colorPickerClasses('text'))}>
        {hex.slice(0, 7).toUpperCase()}
      </span>
      {alpha !== undefined && (
        <span {...stylex.props(triggerStyles.text, triggerStyles.alpha)}>
          {Math.round(alpha * 100)}%
        </span>
      )}
    </>
  );

  if (variant === 'chip') {
    return (
      <button
        {...common}
        {...styleProps([focusRing.info, triggerStyles.chip, chipSize[size]], rootClassName, style)}
      >
        <Swatch className={swatchClassName} color={hex} radius="50%" size={SWATCH_CHIP[size]} />
        {text}
      </button>
    );
  }

  const fieldSwatch = SWATCH_FIELD[size];
  return (
    <button
      {...common}
      {...styleProps(
        [
          ...inputRootStyles({ size, variant: isDarkMode ? 'filled' : 'outlined' }),
          triggerStyles.field,
          fieldSize[size],
        ],
        rootClassName,
        style,
      )}
    >
      <Swatch
        className={swatchClassName}
        color={hex}
        radius={Math.round(fieldSwatch / 4)}
        size={fieldSwatch}
      />
      {text}
      <ChevronDown {...styleProps(triggerStyles.caret, colorPickerClasses('caret'))} size={14} />
    </button>
  );
};

export default ColorTrigger;
