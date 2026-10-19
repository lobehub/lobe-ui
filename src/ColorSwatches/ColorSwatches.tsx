'use client';

import chroma from 'chroma-js';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';

import { Center, Flexbox } from '@/Flex';
import { useControlledState } from '@/hooks/useControlledState';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Tooltip from '@/Tooltip';
import { toDataAttributes } from '@/utils/bem';
import { safeReadableColor } from '@/utils/safeReadableColor';

import CustomPicker from './CustomPicker';
import { colorSwatchesClasses } from './stable';
import { styles } from './style';
import type { ColorSwatchesPickerRenderProps, ColorSwatchesProps } from './type';

const ColorSwatches: FC<ColorSwatchesProps> = ({
  enableColorPicker,
  enableColorSwatches = true,
  defaultValue,
  value,
  style,
  colors,
  onChange,
  size = 24,
  shape = 'circle',
  texts,
  renderPicker,
  ref,
  className,
  ...rest
}) => {
  const [active, setActive] = useControlledState(defaultValue, {
    defaultValue,
    onChange,
    value,
  });

  // Convert size prop to CSS variable
  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--color-swatches-size': `${size}px`,
    }),
    [size],
  );

  const isCustomActive = useMemo(
    () => active && active !== cssVar.colorPrimary && !colors.some((c) => c.color === active),
    [active, colors],
  );

  const pickerProps: ColorSwatchesPickerRenderProps = {
    active: !!isCustomActive,
    onChange: setActive,
    presets: colors.map((c) => c.color),
    shape,
    size,
    value: isCustomActive ? active : undefined,
  };

  const defaultPicker = enableColorPicker && (
    <CustomPicker
      {...pickerProps}
      current={active}
      label={texts?.custom || 'Custom'}
      standalone={!enableColorSwatches}
    />
  );

  return (
    <Flexbox
      horizontal
      gap={6}
      ref={ref}
      {...toDataAttributes({ shape, size })}
      {...styleProps(styles.root, clsx(colorSwatchesClasses(), className), {
        ...cssVariables,
        ...style,
      })}
      {...rest}
    >
      {enableColorSwatches &&
        colors.map((c, i) => {
          const color = c.color || cssVar.colorPrimary;
          const isActive = (!active && !c.color) || color === active;
          // Check if color is transparent or CSS variable (which chroma can't parse)
          const isTransparent =
            c.color === 'transparent' ||
            (c.color &&
              !c.color.startsWith('var(') &&
              (() => {
                try {
                  return chroma(c.color).alpha() === 0;
                } catch {
                  return false;
                }
              })());
          return (
            <Tooltip key={c?.key || i} title={c.title}>
              <Center
                {...styleProps(
                  [
                    styles.container,
                    shape === 'circle' ? styles.shapeCircle : styles.shapeSquare,
                    !!isTransparent && styles.transparent,
                    isActive && styles.activeContainer,
                  ],
                  colorSwatchesClasses('item'),
                  { background: isTransparent ? undefined : color },
                )}
                onClick={() => setActive(c.color || undefined)}
              >
                {isActive && (
                  <Icon
                    color={`color-mix(in srgb, ${safeReadableColor(color)} 33%, transparent)`}
                    icon={CheckIcon}
                    size={{ size: 14, strokeWidth: 4 }}
                    {...styleProps(styles.check, colorSwatchesClasses('check'))}
                  />
                )}
              </Center>
            </Tooltip>
          );
        })}
      {enableColorPicker &&
        (renderPicker ? renderPicker(pickerProps, defaultPicker) : defaultPicker)}
    </Flexbox>
  );
};

ColorSwatches.displayName = 'ColorSwatches';

export default ColorSwatches;
