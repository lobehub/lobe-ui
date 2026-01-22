'use client';

import { ColorPicker } from 'antd';
import { cssVar, cx } from 'antd-style';
import chroma from 'chroma-js';
import { CheckIcon } from 'lucide-react';
import { rgba } from 'polished';
import { type FC, useMemo } from 'react';
import useMergeState from 'use-merge-value';

import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Tooltip from '@/Tooltip';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles } from './style';
import type { ColorSwatchesProps } from './type';

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
  ref,
  ...rest
}) => {
  const [active, setActive] = useMergeState(defaultValue, {
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

  return (
    <Flexbox
      gap={6}
      horizontal
      ref={ref}
      style={{
        ...cssVariables,
        flexWrap: 'wrap',
        ...style,
      }}
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
          // Get actual color value for readableColor (CSS variables can't be parsed)
          const actualColorForReadable = c.color?.startsWith('var(') ? cssVar.colorPrimary : color;
          return (
            <Tooltip key={c?.key || i} title={c.title}>
              <Center
                className={cx(
                  styles.container,
                  isTransparent && styles.transparent,
                  isActive && styles.active,
                )}
                onClick={() => setActive(c.color || undefined)}
                style={{
                  background: isTransparent ? undefined : color,
                  borderRadius: shape === 'circle' ? '50%' : cssVar.borderRadius,
                }}
              >
                {isActive && (
                  <Icon
                    color={rgba(safeReadableColor(actualColorForReadable), 0.33)}
                    icon={CheckIcon}
                    size={{ size: 14, strokeWidth: 4 }}
                    style={{
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </Center>
            </Tooltip>
          );
        })}
      {enableColorPicker && (
        <Tooltip title={texts?.custom || 'Custom'}>
          <ColorPicker
            arrow={false}
            className={cx(
              styles.picker,
              enableColorSwatches && styles.conic,
              isCustomActive && styles.active,
            )}
            defaultValue={cssVar.colorPrimary}
            disabledAlpha
            format={'hex'}
            onChangeComplete={(c) => {
              if (c.toHexString() === cssVar.colorPrimary) {
                setActive('');
              } else {
                setActive(c.toHexString());
              }
            }}
            presets={
              enableColorSwatches
                ? undefined
                : [
                    {
                      colors: colors.map((c) => c.color),
                      label: texts?.presets || 'Presets',
                    },
                  ]
            }
            style={{
              borderRadius: shape === 'circle' ? '50%' : cssVar.borderRadius,
            }}
            value={enableColorSwatches ? undefined : active}
          />
        </Tooltip>
      )}
    </Flexbox>
  );
};

ColorSwatches.displayName = 'ColorSwatches';

export default ColorSwatches;
