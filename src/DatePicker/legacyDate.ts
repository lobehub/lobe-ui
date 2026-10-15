import dayjs from 'dayjs';

import dateGenerateConfig from './dateGenerateConfig';
import dayjsGenerateConfig from './generateConfig';

const DATE_KEYS = [
  'defaultPickerValue',
  'defaultValue',
  'max',
  'maxDate',
  'min',
  'minDate',
  'pickerValue',
  'value',
] as const;

type Convert = (v: unknown) => unknown;

const toDayjs: Convert = (v) =>
  v instanceof Date || typeof v === 'string' || typeof v === 'number' ? dayjs(v) : v;

const toDate: Convert = (v) => {
  if (dayjs.isDayjs(v)) return v.toDate();
  if (typeof v === 'string' || typeof v === 'number') return dayjs(v).toDate();
  return v;
};

const convertValue = (v: unknown, convert: Convert): unknown => {
  if (!Array.isArray(v)) return convert(v);
  let changed = false;
  const next = v.map((item) => {
    const converted = item === null || item === undefined ? item : convert(item);
    if (converted !== item) changed = true;
    return converted;
  });
  return changed ? next : v;
};

/**
 * Normalises date props to the picker's date type, so both pickers take any of
 * `Date` / `Dayjs` / date string / timestamp (also inside a range tuple or `multiple` array):
 * the default (native `Date`) pickers convert `Dayjs` / strings / timestamps to `Date`, the
 * dayjs pickers convert `Date` / strings / timestamps to `Dayjs`. Pickers generated over
 * another date library get their props untouched.
 */
export const normalizeLegacyDateProps = <P extends object>(
  props: P,
  generateConfig: unknown,
): P => {
  const convert =
    generateConfig === dayjsGenerateConfig
      ? toDayjs
      : generateConfig === dateGenerateConfig
        ? toDate
        : undefined;
  if (!convert) return props;
  let next: P | undefined;
  for (const key of DATE_KEYS) {
    const v = (props as any)[key];
    if (v === undefined || v === null) continue;
    const converted = convertValue(v, convert);
    if (converted !== v) {
      next ??= { ...props };
      (next as any)[key] = converted;
    }
  }
  return next ?? props;
};

/** The previous lobe DateRangePicker never passed `null`: a cleared range is `[null, null]`. */
export const isNativeDateConfig = (generateConfig: unknown) =>
  generateConfig === dateGenerateConfig;
