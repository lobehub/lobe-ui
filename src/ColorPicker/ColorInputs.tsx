'use client';

import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input, InputNumber } from '@/Input';
import {
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/Select';

import {
  type ColorFormat,
  formatColor,
  fromHsl,
  fromRgb,
  type Hsva,
  normalizeHexInput,
  parseColor,
  toHsl,
  toRgb,
} from './color';
import { styles } from './style';

type Channels = [number, number, number];

const CHANNELS: Record<Exclude<ColorFormat, 'hex'>, { labels: string[]; max: Channels }> = {
  hsl: { labels: ['H', 'S', 'L'], max: [360, 100, 100] },
  rgb: { labels: ['R', 'G', 'B'], max: [255, 255, 255] },
};

const FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl'];

export interface ColorInputsProps {
  alpha: boolean;
  alphaLabel: string;
  format: ColorFormat;
  formatLabel: string;
  hsva: Hsva;
  onCommit: (next: Hsva) => void;
  onFormatChange: (format: ColorFormat) => void;
}

const ColorInputs = ({
  alpha,
  alphaLabel,
  format,
  formatLabel,
  hsva,
  onCommit,
  onFormatChange,
}: ColorInputsProps) => {
  const hex = formatColor(hsva, alpha);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setDrafts({});
  }, [hex, format]);

  const channels = (kind: Exclude<ColorFormat, 'hex'>): Channels =>
    kind === 'rgb' ? toRgb(hsva) : toHsl(hsva);

  const hints: Record<ColorFormat, string> = {
    hex: hex.slice(0, 7).toUpperCase(),
    hsl: toHsl(hsva).join(' '),
    rgb: toRgb(hsva).join(' '),
  };

  const commitHex = () => {
    const draft = drafts.hex;
    if (draft === undefined) return;
    const normalized = normalizeHexInput(draft);
    if (!normalized) return setDrafts({});
    onCommit(parseColor(normalized, hsva.h));
  };

  const commitChannel = (kind: Exclude<ColorFormat, 'hex'>, index: number) => {
    const draft = drafts[`${kind}${index}`];
    if (draft === undefined) return;
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) return setDrafts({});
    const next = channels(kind);
    next[index] = Math.min(CHANNELS[kind].max[index], Math.max(0, parsed));
    onCommit(kind === 'rgb' ? fromRgb(next, hsva) : fromHsl(next, hsva));
  };

  const field = (key: string, label: string, value: string, onCommitField: () => void) => (
    <Input
      aria-label={label}
      key={key}
      prefix={format === 'hex' ? '#' : undefined}
      size="small"
      title={label}
      value={drafts[key] ?? value}
      variant="filled"
      className={
        stylex.props(styles.channelField, format !== 'hex' && styles.channelCompact).className
      }
      classNames={
        format === 'hex' ? undefined : { input: stylex.props(styles.channelInput).className }
      }
      onBlur={onCommitField}
      onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
      onPressEnter={onCommitField}
    />
  );

  return (
    <div {...stylex.props(styles.inputs)}>
      <SelectRoot
        value={format}
        onValueChange={(next) => next && onFormatChange(next as ColorFormat)}
      >
        <SelectTrigger
          aria-label={formatLabel}
          className={stylex.props(styles.formatSelect).className}
          size="small"
          variant="filled"
        >
          <SelectValue>{(current) => String(current).toUpperCase()}</SelectValue>
          <SelectIcon>
            <ChevronDown size={12} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup className={stylex.props(styles.formatPopup).className}>
              <SelectList>
                {FORMATS.map((item) => (
                  <SelectItem key={item} value={item}>
                    <SelectItemText>{item.toUpperCase()}</SelectItemText>
                    <span {...stylex.props(styles.formatHint)}>{hints[item]}</span>
                    <SelectItemIndicator>
                      <Check size={14} />
                    </SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
      {format === 'hex'
        ? field('hex', 'HEX', hex.slice(1).toUpperCase(), commitHex)
        : channels(format).map((value, index) =>
            field(`${format}${index}`, CHANNELS[format].labels[index], String(value), () =>
              commitChannel(format, index),
            ),
          )}
      {alpha && (
        <InputNumber
          aria-label={alphaLabel}
          className={stylex.props(styles.alphaField).className}
          controls={false}
          max={100}
          min={0}
          size="small"
          suffix="%"
          value={Math.round(hsva.a * 100)}
          variant="filled"
          onChange={(a) => a !== null && onCommit({ ...hsva, a: a / 100 })}
        />
      )}
    </div>
  );
};

export default ColorInputs;
