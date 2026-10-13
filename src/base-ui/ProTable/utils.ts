import type { Key, ReactNode } from 'react';

import type {
  ProColumnType,
  ProTableColumnsStateMap,
  ProTableValueEnum,
  ProTableValueEnumItem,
  ProTableValueType,
} from './type';

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

export const isEmptyValue = (value: unknown) =>
  isNil(value) || value === '' || (Array.isArray(value) && value.length === 0);

/** Field / state key of a column: `key`, then the dot-joined `dataIndex`, then its position. */
export const getProColumnKey = (column: ProColumnType<any>, index: number | string): string => {
  if (!isNil(column.key)) return String(column.key);
  const { dataIndex } = column;
  if (Array.isArray(dataIndex)) return dataIndex.join('.');
  if (!isNil(dataIndex)) return String(dataIndex);
  return `col-${index}`;
};

/** The name a column takes in the search form (and in `params`). */
export const getFieldName = (column: ProColumnType<any>, index: number) => {
  const { dataIndex } = column;
  if (Array.isArray(dataIndex)) return dataIndex.join('.');
  if (!isNil(dataIndex)) return String(dataIndex);
  return getProColumnKey(column, index);
};

export const getByPath = (record: any, dataIndex: ProColumnType<any>['dataIndex']) => {
  if (isNil(dataIndex) || isNil(record)) return undefined;
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce<any>((acc, key) => (isNil(acc) ? undefined : acc[key as any]), record);
};

/** Set `a.b.c` style names into a nested object. */
export const setByPath = (target: Record<string, any>, name: string, value: any) => {
  const path = name.split('.');
  let cursor = target;
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      cursor[key] = value;
      return;
    }
    if (typeof cursor[key] !== 'object' || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key];
  });
  return target;
};

export const resolveValueType = (
  column: ProColumnType<any>,
  record?: any,
): ProTableValueType | undefined =>
  typeof column.valueType === 'function' ? column.valueType(record) : column.valueType;

export const resolveValueEnum = (
  column: ProColumnType<any>,
  record?: any,
): ProTableValueEnum | undefined =>
  typeof column.valueEnum === 'function' ? column.valueEnum(record) : column.valueEnum;

const isEnumItem = (value: unknown): value is ProTableValueEnumItem =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  'text' in (value as Record<string, unknown>);

export interface ValueEnumEntry {
  color?: string;
  disabled?: boolean;
  status?: ProTableValueEnumItem['status'];
  text: ReactNode;
  value: string;
}

/** `valueEnum` as an ordered list of `{ value, text, status }`. */
export const valueEnumToList = (valueEnum?: ProTableValueEnum): ValueEnumEntry[] => {
  if (!valueEnum) return [];
  const entries: [unknown, unknown][] =
    valueEnum instanceof Map ? [...valueEnum.entries()] : Object.entries(valueEnum);
  return entries.map(([value, item]) =>
    isEnumItem(item)
      ? { ...item, value: String(value) }
      : { text: item as ReactNode, value: String(value) },
  );
};

export const findValueEnum = (valueEnum: ProTableValueEnum | undefined, value: unknown) =>
  valueEnumToList(valueEnum).find((item) => item.value === String(value));

// ================================ Dates ================================

const pad = (value: number) => String(value).padStart(2, '0');

export const formatDate = (date: Date, withTime = false, timeOnly = false) => {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  if (timeOnly) return time;
  return withTime ? `${day} ${time}` : day;
};

export const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number' || typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const DATE_TYPES = new Set<ProTableValueType>(['date', 'dateTime', 'time']);
const RANGE_TYPES = new Set<ProTableValueType>(['dateRange', 'dateTimeRange']);

export const isDateType = (valueType?: ProTableValueType) =>
  !!valueType && (DATE_TYPES.has(valueType) || RANGE_TYPES.has(valueType));
export const isRangeType = (valueType?: ProTableValueType) =>
  !!valueType && RANGE_TYPES.has(valueType);

export type DateFormatter = 'string' | 'number' | false | ((value: Date, valueType: string) => any);

export const formatDateValue = (
  value: unknown,
  valueType: ProTableValueType,
  formatter: DateFormatter,
): any => {
  if (Array.isArray(value)) return value.map((item) => formatDateValue(item, valueType, formatter));
  const date = value instanceof Date ? value : null;
  if (!date) return value;
  if (formatter === false) return date;
  if (formatter === 'number') return date.getTime();
  if (typeof formatter === 'function') return formatter(date, valueType);
  return formatDate(
    date,
    valueType === 'dateTime' || valueType === 'dateTimeRange',
    valueType === 'time',
  );
};

// ============================ Columns state ============================

export const readPersistedState = (
  key?: string,
  type: 'localStorage' | 'sessionStorage' = 'localStorage',
): ProTableColumnsStateMap | undefined => {
  if (!key || typeof window === 'undefined') return undefined;
  try {
    const raw = window[type]?.getItem(key);
    return raw ? (JSON.parse(raw) as ProTableColumnsStateMap) : undefined;
  } catch {
    return undefined;
  }
};

export const writePersistedState = (
  key: string | undefined,
  type: 'localStorage' | 'sessionStorage' = 'localStorage',
  value?: ProTableColumnsStateMap,
) => {
  if (!key || typeof window === 'undefined') return;
  try {
    if (value) window[type]?.setItem(key, JSON.stringify(value));
    else window[type]?.removeItem(key);
  } catch {
    // Storage may be unavailable (private mode, quota); the in-memory state still works.
  }
};

export const toKeyList = (keys: readonly Key[] | undefined) => (keys ? [...keys] : []);
