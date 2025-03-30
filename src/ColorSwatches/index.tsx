'use client';

import { ColorPicker } from 'antd';
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
      <Flexbox gap={4} horizontal style={{ flexWrap: 'wrap', ...style }} {...rest}>
        {enableColorSwatches &&
          colors.map((c) => {
            const color = c.color || theme.colorPrimary;
            const isActive = (!active && !c.color) || color === active;
            return (
              <Tooltip key={c.label} title={c.label}>
                <Center
                  className={cx(styles.container, isActive && styles.active)}
                  onClick={() => setActive(c.color)}
                  style={{
                    background: color,
                    borderRadius: shape === 'circle' ? '50%' : theme.borderRadius,
                  }}
                >
                  {isActive && (
                    <Icon
                      color={rgba(readableColor(color), 0.33)}
                      icon={CheckIcon}
                      size={{ fontSize: 14, strokeWidth: 4 }}
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
            <Center style={{ position: 'relative' }}>
              {isCustomActive && (
                <Icon
                  color={enableColorSwatches ? '#222' : rgba(readableColor(active), 0.33)}
                  icon={CheckIcon}
                  size={{ fontSize: 14, strokeWidth: 4 }}
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    zIndex: 1,
                  }}
                />
              )}
              <ColorPicker
                arrow={false}
                className={cx(
                  styles.picker,
                  enableColorSwatches && styles.conic,
                  isCustomActive && styles.active,
                )}
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
            </Center>
          </Tooltip>
        )}
      </Flexbox>
    );
  },
);

export default ColorSwatches;
