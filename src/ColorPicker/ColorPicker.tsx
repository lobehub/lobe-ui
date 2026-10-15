'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import colorPickerMessages from '@/i18n/resources/en/colorPicker';
import { useTranslation } from '@/i18n/useTranslation';
import { panelStyles } from '@/internal/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/Popover';

import { type ColorFormat, formatColor, type Hsva, parseColor } from './color';
import ColorPanel from './ColorPanel';
import { pushRecentColor } from './recent';
import ColorTrigger from './Trigger';
import type { ColorPickerProps } from './type';

const DEFAULT_COLOR = '#000000';

const ColorPicker = memo<ColorPickerProps>(
  ({
    alpha = false,
    children,
    className,
    defaultFormat = 'hex',
    defaultValue = DEFAULT_COLOR,
    disabled,
    onChange,
    onChangeComplete,
    presets,
    recent = true,
    showText,
    size = 'middle',
    style,
    trigger = showText ? 'field' : 'swatch',
    value,
  }) => {
    const { t } = useTranslation(colorPickerMessages);
    const [hex, setHex] = useControlledState<string>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [hsva, setHsva] = useState<Hsva>(() => parseColor(hex));
    const [format, setFormat] = useState<ColorFormat>(defaultFormat);
    const [original, setOriginal] = useState(hex);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!hex) return;
      setHsva((current) =>
        formatColor(current, alpha) === hex.toLowerCase() ? current : parseColor(hex, current.h),
      );
    }, [hex, alpha]);

    const update = (next: Hsva) => {
      setHsva(next);
      setHex(formatColor(next, alpha));
    };
    const commit = (next: Hsva) => {
      const nextHex = formatColor(next, alpha);
      if (recent) pushRecentColor(nextHex);
      onChangeComplete?.(nextHex);
    };
    const apply = (next: Hsva) => {
      update(next);
      commit(next);
    };

    return (
      <PopoverRoot
        onOpenChange={(open) => {
          if (open) setOriginal(hex);
        }}
      >
        <PopoverTriggerElement nativeButton disabled={disabled}>
          {children ?? (
            <ColorTrigger
              alpha={alpha && hex ? hsva.a : undefined}
              className={className}
              disabled={disabled}
              emptyLabel={t('colorPicker.empty')}
              hex={hex}
              label={t('colorPicker.trigger')}
              size={size}
              style={style}
              variant={trigger}
            />
          )}
        </PopoverTriggerElement>
        <PopoverPortal>
          <PopoverPositioner placement="bottomLeft">
            <PopoverPopup
              ref={popupRef}
              xstyle={panelStyles.popup}
              initialFocus={() =>
                popupRef.current?.querySelector<HTMLElement>('[role="slider"]') ?? true
              }
            >
              <ColorPanel
                alpha={alpha}
                format={format}
                hsva={hsva}
                original={original}
                presets={presets}
                recent={recent}
                labels={{
                  alpha: t('colorPicker.alpha'),
                  eyeDropper: t('colorPicker.eyeDropper'),
                  format: t('colorPicker.format'),
                  hue: t('colorPicker.hue'),
                  original: t('colorPicker.original'),
                  presets: t('colorPicker.presets'),
                  recent: t('colorPicker.recent'),
                  saturation: t('colorPicker.saturation'),
                  swatches: t('colorPicker.swatches'),
                }}
                onApply={apply}
                onCommit={commit}
                onFormatChange={setFormat}
                onUpdate={update}
              />
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </PopoverRoot>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
