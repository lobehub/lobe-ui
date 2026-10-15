'use client';

import * as stylex from '@stylexjs/stylex';
import { Pipette } from 'lucide-react';
import type { CSSProperties } from 'react';

import Icon from '@/Icon';
import { Slider } from '@/Slider';
import { focusRing } from '@/styles/stylex/focusRing';

import { type ColorFormat, formatColor, type Hsva, parseColor } from './color';
import ColorInputs from './ColorInputs';
import SaturationArea from './SaturationArea';
import { styles } from './style';
import Swatches from './Swatches';

const hasEyeDropper = () => typeof window !== 'undefined' && 'EyeDropper' in window;

type EyeDropperConstructor = new () => { open: () => Promise<{ sRGBHex: string }> };

export interface ColorPanelLabels {
  alpha: string;
  eyeDropper: string;
  format: string;
  hue: string;
  original: string;
  presets: string;
  recent: string;
  saturation: string;
  swatches: string;
}

export interface ColorPanelProps {
  alpha: boolean;
  format: ColorFormat;
  hsva: Hsva;
  labels: ColorPanelLabels;
  onApply: (next: Hsva) => void;
  onCommit: (next: Hsva) => void;
  onFormatChange: (format: ColorFormat) => void;
  onUpdate: (next: Hsva) => void;
  original: string;
  presets?: string[];
  recent: boolean;
}

const ColorPanel = ({
  alpha,
  format,
  hsva,
  labels,
  onApply,
  onCommit,
  onFormatChange,
  onUpdate,
  original,
  presets,
  recent,
}: ColorPanelProps) => {
  const hex = formatColor(hsva, alpha);
  const opaque = formatColor(hsva, false);
  const sliderClassNames = (track: keyof typeof styles) => ({
    indicator: stylex.props(styles.hidden).className,
    thumb: stylex.props(styles.sliderThumb).className,
    track: stylex.props(styles[track]).className,
  });

  return (
    <div {...stylex.props(styles.panel)}>
      <SaturationArea
        color={opaque}
        hue={hsva.h}
        label={labels.saturation}
        saturation={hsva.s}
        value={hsva.v}
        onChange={(s, v) => onUpdate({ ...hsva, s, v })}
        onChangeComplete={(s, v) => onCommit({ ...hsva, s, v })}
      />
      <div {...stylex.props(styles.controls)}>
        {hasEyeDropper() && (
          <button
            aria-label={labels.eyeDropper}
            type="button"
            {...stylex.props(focusRing.info, styles.eyeDropper)}
            onClick={async () => {
              const dropper = new (
                window as unknown as { EyeDropper: EyeDropperConstructor }
              ).EyeDropper();
              const result = await dropper.open().catch(() => null);
              if (result) onApply({ ...parseColor(result.sRGBHex, hsva.h), a: hsva.a });
            }}
          >
            <Icon icon={Pipette} size={14} />
          </button>
        )}
        <div {...stylex.props(styles.sliders)}>
          <Slider
            aria-label={labels.hue}
            classNames={sliderClassNames('hueTrack')}
            max={360}
            min={0}
            value={hsva.h}
            styles={{
              track: { '--lobe-color-picker-thumb': `hsl(${hsva.h} 100% 50%)` } as CSSProperties,
            }}
            onChange={(h) => onUpdate({ ...hsva, h })}
            onChangeComplete={(h) => onCommit({ ...hsva, h })}
          />
          {alpha && (
            <Slider
              aria-label={labels.alpha}
              classNames={sliderClassNames('alphaTrack')}
              max={100}
              min={0}
              value={Math.round(hsva.a * 100)}
              styles={{
                track: {
                  '--lobe-color-picker-alpha': opaque,
                  '--lobe-color-picker-thumb': hex,
                } as CSSProperties,
              }}
              onChange={(a) => onUpdate({ ...hsva, a: a / 100 })}
              onChangeComplete={(a) => onCommit({ ...hsva, a: a / 100 })}
            />
          )}
        </div>
        <div {...stylex.props(styles.compare)} style={{ height: alpha ? 30 : 28 }}>
          <button
            aria-label={labels.original}
            title={labels.original}
            type="button"
            {...stylex.props(focusRing.info, styles.compareHalf, styles.compareRestore)}
            style={{ background: original }}
            onClick={() => onApply(parseColor(original, hsva.h))}
          />
          <span {...stylex.props(styles.compareHalf)} style={{ background: hex }} />
        </div>
      </div>
      <ColorInputs
        alpha={alpha}
        alphaLabel={labels.alpha}
        format={format}
        formatLabel={labels.format}
        hsva={hsva}
        onCommit={onApply}
        onFormatChange={onFormatChange}
      />
      <Swatches
        current={hex}
        labels={{ presets: labels.presets, recent: labels.recent, swatches: labels.swatches }}
        presets={presets}
        recent={recent}
        onPick={(color) => onApply({ ...parseColor(color, hsva.h), a: parseColor(color).a })}
      />
    </div>
  );
};

export default ColorPanel;
