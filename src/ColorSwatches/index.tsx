'use client';

import { ColorPicker } from 'antd';
import chroma from 'chroma-js';
import { CheckIcon } from 'lucide-react';
import { readableColor, rgba } from 'polished';
import { memo } from 'react';
import { Center, Flexbox, FlexboxProps } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import Icon from '@/Icon';
import Tooltip from '@/Tooltip';

import { useStyles } from './style';

interface ColorItem {
  color: string;
  label: string;
}

export interface ColorSwatchesProps extends Omit<FlexboxProps, 'onChange'> {
  colors: ColorItem[];
  defaultValue?: string;
  enableColorPicker?: boolean;
  enableColorSwatches?: boolean;
  onChange?: (color?: string) => void;
  shape?: 'circle' | 'square';
  size?: number;
  texts?: {
    custom: string;
    presets: string;
  };
  value?: string;
}

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
    ...rest
  }) => {
    const [active, setActive] = useMergeState(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const { cx, styles, theme } = useStyles(size);

    const isCustomActive =
      active && active !== theme.colorPrimary && !colors.some((c) => c.color === active);

    return (
      <Flexbox gap={6} horizontal style={{ flexWrap: 'wrap', ...style }} {...rest}>
        {enableColorSwatches &&
          colors.map((c) => {
            const color = c.color || theme.colorPrimary;
            const isActive = (!active && !c.color) || color === active;
            const isTransparent = c.color === 'transparent' || chroma(c.color).alpha() === 0;
            return (
              <Tooltip key={c.label} title={c.label}>
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

export default ColorSwatches;
