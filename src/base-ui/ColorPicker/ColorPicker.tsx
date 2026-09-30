'use client';

import { cx, useThemeMode } from 'antd-style';
import { Pipette } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import { Input, InputNumber } from '@/base-ui/Input';
import { rootVariants } from '@/base-ui/Input/style';
import { panelStyles } from '@/base-ui/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';
import { Slider } from '@/base-ui/Slider';
import colorPickerMessages from '@/i18n/resources/en/colorPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

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
      <span className={styles.swatch} style={{ height: dimension, width: dimension }}>
        <span style={{ background: hex }} />
      </span>
    );

    const trigger =
      children ??
      (showText ? (
        <button
          aria-label={t('colorPicker.trigger')}
          disabled={disabled}
          style={style}
          type="button"
          className={cx(
            rootVariants({ size, variant: isDarkMode ? 'filled' : 'outlined' }),
            styles.textTrigger,
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
          className={cx(styles.swatchButton, className)}
          disabled={disabled}
          style={style}
          type="button"
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
              <div className={styles.panel}>
                <div className={styles.summary}>
                  {swatch(40)}
                  <div>
                    <div className={styles.value}>{hex.toUpperCase()}</div>
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
                    indicator: styles.hidden,
                    thumb: styles.sliderThumb,
                    track: styles.hueTrack,
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
                      indicator: styles.hidden,
                      thumb: styles.sliderThumb,
                      track: styles.alphaTrack,
                    }}
                    styles={{
                      track: {
                        backgroundImage: `linear-gradient(to right, transparent, ${formatColor(hsva, false)})`,
                      },
                    }}
                    onChange={(a) => update({ ...hsva, a: a / 100 })}
                    onChangeComplete={(a) => commit({ ...hsva, a: a / 100 })}
                  />
                )}
                <div className={styles.hexRow}>
                  <Input
                    aria-label="HEX"
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
                      controls={false}
                      max={100}
                      min={0}
                      style={{ width: 76 }}
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
                    className={styles.presets}
                    role="group"
                  >
                    {presets.map((color) => (
                      <button
                        aria-label={color}
                        aria-pressed={color.toLowerCase() === hex.slice(0, 7).toLowerCase()}
                        className={styles.preset}
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
