import type { SelectOption, SelectOptionGroup, SelectOptions } from './type';

export const isGroupOption = <Value>(
  option: SelectOption<Value> | SelectOptionGroup<Value>,
): option is SelectOptionGroup<Value> => Boolean((option as SelectOptionGroup<Value>).options);

export const getOptionSearchText = <Value>(option: SelectOption<Value>): string => {
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  if (typeof option.value === 'string' || typeof option.value === 'number') {
    return String(option.value);
  }
  if (option.title) return option.title;
  return '';
};

const ESCAPE_REGEXP = /[$()*+.?[\\\]^{|}]/g;
const escapeRegExp = (value: string) => value.replaceAll(ESCAPE_REGEXP, '\\$&');

export const splitBySeparators = (value: string, separators?: string[]): string[] => {
  if (!separators || separators.length === 0) return [value];
  const pattern = separators.map(escapeRegExp).join('|');
  return value.split(new RegExp(pattern, 'g'));
};

export const countVirtualItems = (items: SelectOptions): number =>
  items.reduce((count, item) => {
    if (isGroupOption(item)) {
      return count + item.options.length + 1;
    }
    return count + 1;
  }, 0);

export const isValueEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === '';
