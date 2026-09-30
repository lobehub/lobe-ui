'use client';

import { cssVar, cx } from 'antd-style';
import chroma from 'chroma-js';
import { CheckIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';
import useMergeState from 'use-merge-value';

import { ColorPicker } from '@/base-ui/ColorPicker';
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
      horizontal
      gap={6}
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
          return (
            <Tooltip key={c?.key || i} title={c.title}>
              <Center
                className={cx(
                  styles.container,
                  isTransparent && styles.transparent,
                  isActive && styles.active,
                )}
                style={{
                  background: isTransparent ? undefined : color,
                  borderRadius: shape === 'circle' ? '50%' : cssVar.borderRadius,
                }}
                onClick={() => setActive(c.color || undefined)}
              >
                {isActive && (
                  <Icon
                    color={`color-mix(in srgb, ${safeReadableColor(color)} 33%, transparent)`}
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
          <span style={{ display: 'inline-flex' }}>
            <ColorPicker
              presets={enableColorSwatches ? undefined : colors.map((c) => c.color)}
              value={isCustomActive ? active : undefined}
              onChangeComplete={setActive}
            >
              <button
                aria-label={texts?.custom || 'Custom'}
                type="button"
                className={cx(
                  styles.picker,
                  enableColorSwatches && styles.conic,
                  isCustomActive && styles.active,
                )}
                style={{
                  background: enableColorSwatches ? undefined : active,
                  borderRadius: shape === 'circle' ? '50%' : cssVar.borderRadius,
                }}
              />
            </ColorPicker>
          </span>
        </Tooltip>
      )}
    </Flexbox>
  );
};

ColorSwatches.displayName = 'ColorSwatches';

export default ColorSwatches;
