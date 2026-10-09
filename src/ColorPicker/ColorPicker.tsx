'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Pipette } from 'lucide-react';
import { type CSSProperties, memo, useEffect, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import colorPickerMessages from '@/i18n/resources/en/colorPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { Input, InputNumber } from '@/Input';
import { rootVariants } from '@/Input/style';
import { panelStyles } from '@/internal/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/Popover';
import { Slider } from '@/Slider';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { formatColor, type Hsva, normalizeHexInput, parseColor } from './color';
import SaturationArea from './SaturationArea';
import { styles } from './style';
import type { ColorPickerProps } from './type';

const DEFAULT_COLOR = '#000000';

const hasEyeDropper = () => typeof window !== 'undefined' && 'EyeDropper' in window;

const ColorPicker = memo<ColorPickerProps>(
  ({
    alpha = false,
    children,
    className,
    defaultValue = DEFAULT_COLOR,
    disabled,
    onChange,
    onChangeComplete,
    presets,
    showText,
    size = 'middle',
    style,
    value,
  }) => {
    const { t } = useTranslation(colorPickerMessages);
    const { isDarkMode } = useThemeMode();
    const [hex, setHex] = useControlledState<string>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [hsva, setHsva] = useState<Hsva>(() => parseColor(hex));
    const [draft, setDraft] = useState(hex.slice(1).toUpperCase());
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setHsva((current) =>
        formatColor(current, alpha) === hex.toLowerCase() ? current : parseColor(hex, current.h),
      );
      setDraft(hex.slice(1).toUpperCase());
    }, [hex, alpha]);

    const update = (next: Hsva) => {
      setHsva(next);
      setHex(formatColor(next, alpha));
    };
    const commit = (next: Hsva) => onChangeComplete?.(formatColor(next, alpha));
    const apply = (next: Hsva) => {
      update(next);
      commit(next);
    };

    const commitDraft = () => {
      const normalized = normalizeHexInput(draft);
      if (!normalized) return setDraft(hex.slice(1).toUpperCase());
      apply(parseColor(normalized, hsva.h));
    };

    const swatch = (dimension: number) => (
      <span {...stylex.props(styles.swatch)} style={{ height: dimension, width: dimension }}>
        <span {...stylex.props(styles.swatchFill)} style={{ background: hex }} />
      </span>
    );

    const trigger =
      children ??
      (showText ? (
        <button
          aria-label={t('colorPicker.trigger')}
          disabled={disabled}
          style={{ cursor: 'pointer', ...style }}
          type="button"
          className={clsx(
            rootVariants({ size, variant: isDarkMode ? 'filled' : 'outlined' }),
            stylex.props(styles.textTrigger).className,
            className,
          )}
        >
          {swatch(18)}
          <span style={{ fontFamily: 'var(--lobe-font-family-code, monospace)' }}>
            {hex.toUpperCase()}
          </span>
        </button>
      ) : (
        <button
          aria-label={t('colorPicker.trigger')}
          disabled={disabled}
          type="button"
          {...styleProps([focusRing.info, styles.swatchButton], className, style)}
        >
          {swatch(24)}
        </button>
      ));

    return (
      <PopoverRoot>
        <PopoverTriggerElement>{trigger}</PopoverTriggerElement>
        <PopoverPortal>
          <PopoverPositioner placement="bottomLeft">
            <PopoverPopup
              className={panelStyles.popup}
              ref={popupRef}
              initialFocus={() =>
                popupRef.current?.querySelector<HTMLElement>('[role="slider"]') ?? true
              }
            >
              <div {...stylex.props(styles.panel)}>
                <div {...stylex.props(styles.summary)}>
                  {swatch(40)}
                  <div>
                    <div {...stylex.props(styles.value)}>{hex.toUpperCase()}</div>
                    <div className={panelStyles.label}>
                      {alpha ? `HEX · ${Math.round(hsva.a * 100)}%` : 'HEX'}
                    </div>
                  </div>
                  {hasEyeDropper() && (
                    <button
                      aria-label={t('colorPicker.eyeDropper')}
                      className={panelStyles.nav}
                      style={{ marginInlineStart: 'auto' }}
                      type="button"
                      onClick={async () => {
                        const dropper = new (
                          window as unknown as {
                            EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
                          }
                        ).EyeDropper();
                        const result = await dropper.open().catch(() => null);
                        if (result) apply({ ...parseColor(result.sRGBHex, hsva.h), a: hsva.a });
                      }}
                    >
                      <Icon icon={Pipette} size={14} />
                    </button>
                  )}
                </div>
                <SaturationArea
                  hue={hsva.h}
                  label={t('colorPicker.saturation')}
                  saturation={hsva.s}
                  value={hsva.v}
                  onChange={(s, v) => update({ ...hsva, s, v })}
                  onChangeComplete={(s, v) => commit({ ...hsva, s, v })}
                />
                <Slider
                  aria-label={t('colorPicker.hue')}
                  max={360}
                  min={0}
                  value={hsva.h}
                  classNames={{
                    indicator: stylex.props(styles.hidden).className,
                    thumb: stylex.props(styles.sliderThumb).className,
                    track: stylex.props(styles.hueTrack).className,
                  }}
                  onChange={(h) => update({ ...hsva, h })}
                  onChangeComplete={(h) => commit({ ...hsva, h })}
                />
                {alpha && (
                  <Slider
                    aria-label={t('colorPicker.alpha')}
                    max={100}
                    min={0}
                    value={Math.round(hsva.a * 100)}
                    classNames={{
                      indicator: stylex.props(styles.hidden).className,
                      thumb: stylex.props(styles.sliderThumb).className,
                      track: stylex.props(styles.alphaTrack).className,
                    }}
                    styles={{
                      track: {
                        '--lobe-color-picker-alpha': formatColor(hsva, false),
                      } as CSSProperties,
                    }}
                    onChange={(a) => update({ ...hsva, a: a / 100 })}
                    onChangeComplete={(a) => commit({ ...hsva, a: a / 100 })}
                  />
                )}
                <div {...stylex.props(styles.hexRow)}>
                  <Input
                    aria-label="HEX"
                    className={stylex.props(styles.hexField).className}
                    prefix={<span className={panelStyles.label}>HEX</span>}
                    value={draft}
                    variant="filled"
                    onBlur={commitDraft}
                    onChange={(event) => setDraft(event.target.value)}
                    onPressEnter={commitDraft}
                  />
                  {alpha && (
                    <InputNumber
                      aria-label={t('colorPicker.alpha')}
                      className={stylex.props(styles.hexField, styles.alphaField).className}
                      controls={false}
                      max={100}
                      min={0}
                      suffix="%"
                      value={Math.round(hsva.a * 100)}
                      variant="filled"
                      onChange={(a) => a !== null && apply({ ...hsva, a: a / 100 })}
                    />
                  )}
                </div>
                {presets && presets.length > 0 && (
                  <div
                    aria-label={t('colorPicker.presets')}
                    {...stylex.props(styles.presets)}
                    role="group"
                  >
                    {presets.map((color) => (
                      <button
                        aria-label={color}
                        aria-pressed={color.toLowerCase() === hex.slice(0, 7).toLowerCase()}
                        {...stylex.props(focusRing.info, styles.preset)}
                        key={color}
                        style={{ background: color }}
                        type="button"
                        onClick={() =>
                          apply({ ...parseColor(color, hsva.h), a: parseColor(color).a })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </PopoverRoot>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
