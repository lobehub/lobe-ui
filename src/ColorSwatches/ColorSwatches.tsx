'use client';

import { ColorPicker } from 'antd';
import chroma from 'chroma-js';
import { CheckIcon } from 'lucide-react';
import { readableColor, rgba } from 'polished';
import { memo, useMemo } from 'react';
import useMergeState from 'use-merge-value';

import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Tooltip from '@/Tooltip';

import { useStyles } from './style';
import type { ColorSwatchesProps } from './type';

const ColorSwatches = memo<ColorSwatchesProps>(
  ({
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
    const { cx, styles, theme } = useStyles(size);

    const isCustomActive = useMemo(
      () => active && active !== theme.colorPrimary && !colors.some((c) => c.color === active),
      [active, colors, theme.colorPrimary],
    );

    return (
      <Flexbox gap={6} horizontal ref={ref} style={{ flexWrap: 'wrap', ...style }} {...rest}>
        {enableColorSwatches &&
          colors.map((c, i) => {
            const color = c.color || theme.colorPrimary;
            const isActive = (!active && !c.color) || color === active;
            const isTransparent = c.color === 'transparent' || chroma(c.color).alpha() === 0;
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
                    borderRadius: shape === 'circle' ? '50%' : theme.borderRadius,
                  }}
                >
                  {isActive && (
                    <Icon
                      color={rgba(readableColor(color), 0.33)}
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
              defaultValue={theme.colorPrimary}
              disabledAlpha
              format={'hex'}
              onChangeComplete={(c) => {
                if (c.toHexString() === theme.colorPrimary) {
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
                borderRadius: shape === 'circle' ? '50%' : theme.borderRadius,
              }}
              value={enableColorSwatches ? undefined : active}
            />
          </Tooltip>
        )}
      </Flexbox>
    );
  },
);

ColorSwatches.displayName = 'ColorSwatches';

export default ColorSwatches;
