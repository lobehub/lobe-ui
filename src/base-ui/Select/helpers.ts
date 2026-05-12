import { type SelectOption, type SelectOptionGroup, type SelectOptions } from './type';

export const isGroupOption = <Value>(
  option: SelectOption<Value> | SelectOptionGroup<Value>,
): option is SelectOptionGroup<Value> => Boolean((option as SelectOptionGroup<Value>).options);

export const getOptionSearchText = <Value>(option: SelectOption<Value>) => {
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  if (typeof option.value === 'string' || typeof option.value === 'number') {
    return String(option.value);
  }
  if (option.title) return option.title;
  return '';
};

const escapeRegExp = (value: string) => value.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&');

export const splitBySeparators = (value: string, separators?: string[]) => {
  if (!separators || separators.length === 0) return [value];
  const pattern = separators.map(escapeRegExp).join('|');
  return value.split(new RegExp(pattern, 'g'));
};

export const countVirtualItems = (items: SelectOptions) =>
  items.reduce((count, item) => {
    if (isGroupOption(item)) {
      return count + item.options.length + 1;
    }
    return count + 1;
  }, 0);

export const isValueEmpty = (value: unknown) =>
  value === null || value === undefined || value === '';

export const normalizeValueFor = (isMultiple: boolean) => (nextValue: any) => {
  if (isMultiple) {
    if (Array.isArray(nextValue)) return nextValue;
    if (nextValue === null || nextValue === undefined) return [];
    return [nextValue];
  }
  if (Array.isArray(nextValue)) return nextValue[0] ?? null;
  return nextValue === undefined ? null : nextValue;
};
