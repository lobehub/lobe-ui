'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { type FC } from 'react';

import { ColorPicker } from '@/ColorPicker';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import Tooltip from '@/Tooltip';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { chipMarker } from './marker.stylex';
import { colorSwatchesClasses } from './stable';
import { styles } from './style';
import type { ColorSwatchesPickerRenderProps } from './type';

interface CustomPickerProps extends ColorSwatchesPickerRenderProps {
  current?: string;
  label: string;
  standalone: boolean;
}

const CustomPicker: FC<CustomPickerProps> = ({
  active,
  current,
  label,
  onChange,
  presets,
  shape,
  standalone,
  value,
}) => {
  const shapeStyle = shape === 'circle' ? styles.shapeCircle : styles.shapeSquare;
  const pickerClassName = colorSwatchesClasses('picker');

  if (standalone)
    return (
      <Tooltip title={label}>
        <span {...stylex.props(styles.inlineFlex)}>
          <ColorPicker presets={presets} value={value} onChangeComplete={onChange}>
            <button
              aria-label={label}
              type="button"
              {...styleProps(
                [styles.picker, shapeStyle, active && styles.activePicker],
                pickerClassName,
                {
                  background: current,
                },
              )}
            />
          </ColorPicker>
        </span>
      </Tooltip>
    );

  const iconColor = value
    ? `color-mix(in srgb, ${safeReadableColor(value)} 33%, transparent)`
    : undefined;

  return (
    <>
      <span aria-hidden {...stylex.props(styles.divider)} />
      {active && value && (
        <ColorPicker value={value} onChangeComplete={onChange}>
          <button
            aria-label={value}
            aria-pressed="true"
            type="button"
            {...styleProps(
              [styles.picker, shapeStyle, styles.chip, styles.activePicker, chipMarker],
              pickerClassName,
              { background: value },
            )}
          >
            <Icon
              className={stylex.props(styles.chipIcon, styles.chipCheck).className}
              color={iconColor}
              icon={CheckIcon}
              size={{ size: 14, strokeWidth: 4 }}
            />
            <Icon
              className={stylex.props(styles.chipIcon, styles.chipEdit).className}
              color={iconColor}
              icon={PencilIcon}
              size={{ size: 12, strokeWidth: 3 }}
            />
          </button>
        </ColorPicker>
      )}
      <Tooltip title={label}>
        <span {...stylex.props(styles.inlineFlex)}>
          <ColorPicker value={value} onChangeComplete={onChange}>
            <button
              aria-label={label}
              type="button"
              {...styleProps(
                [styles.picker, shapeStyle, styles.conic, styles.add],
                pickerClassName,
              )}
            >
              <Icon icon={PlusIcon} size={{ size: 12, strokeWidth: 3 }} />
            </button>
          </ColorPicker>
        </span>
      </Tooltip>
    </>
  );
};

CustomPicker.displayName = 'ColorSwatchesCustomPicker';

export default CustomPicker;
