'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { type FC } from 'react';

import { ColorPicker } from '@/ColorPicker';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import Tooltip from '@/Tooltip';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { chipMarker } from './marker.stylex';
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
  const borderRadius = shape === 'circle' ? '50%' : cssVar.borderRadius;

  if (standalone)
    return (
      <Tooltip title={label}>
        <span style={{ display: 'inline-flex' }}>
          <ColorPicker presets={presets} value={value} onChangeComplete={onChange}>
            <button
              aria-label={label}
              type="button"
              {...stylex.props(styles.picker, active && styles.activePicker)}
              style={{ background: current, borderRadius }}
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
            {...stylex.props(styles.picker, styles.chip, styles.activePicker, chipMarker)}
            style={{ background: value, borderRadius }}
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
        <span style={{ display: 'inline-flex' }}>
          <ColorPicker value={value} onChangeComplete={onChange}>
            <button
              aria-label={label}
              type="button"
              {...stylex.props(styles.picker, styles.conic, styles.add)}
              style={{ borderRadius }}
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
