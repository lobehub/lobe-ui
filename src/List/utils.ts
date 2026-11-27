import type { ListDividerType, ListItem } from './type';

export const isListDivider = (item: ListItem): item is ListDividerType => item.type === 'divider';

/** A string row is a label-only item keyed by its index. */
export const normalizeListItem = (item: ListItem | string, index: number): ListItem =>
  typeof item === 'string' ? { key: index, label: item } : item;
