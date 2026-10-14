import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { PREFIX_CLS } from './style';

interface Preset {
  label: ReactNode;
  value: unknown;
}

const sameDay = (a: any, b: any): boolean => {
  if (!a || !b) return !a && !b;
  if (typeof a.isSame === 'function') return a.isSame(b, 'day');
  return a === b;
};

const sameValue = (a: any, b: any): boolean => {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => sameDay(item, b[i]));
  }
  return sameDay(a, b);
};

export const PRESET_ACTIVE_CLS = `${PREFIX_CLS}-preset-active`;

/**
 * rc-picker renders `presets` as the popup sidebar but has no "current preset" state.
 * Mirror the picked value (controlled or not) and wrap the matching preset's label so the
 * sidebar can show it as selected (`li:has(> .lobe-picker-preset-active)`).
 */
export const usePresetActive = <P extends Preset>(
  presets: P[] | undefined,
  value: unknown,
  defaultValue: unknown,
) => {
  const [inner, setInner] = useState<unknown>(defaultValue);
  const current = value !== undefined ? value : inner;

  const track = useCallback((next: unknown) => setInner(next), []);

  const mapped = useMemo(() => {
    if (!presets?.length || !current) return presets;
    return presets.map((preset) => {
      const v =
        typeof preset.value === 'function' ? (preset.value as () => unknown)() : preset.value;
      if (!sameValue(v, current)) return preset;
      return { ...preset, label: <span className={PRESET_ACTIVE_CLS}>{preset.label}</span> };
    });
  }, [presets, current]);

  return { presets: mapped, track };
};
