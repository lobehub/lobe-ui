import { type ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface SortableListItem {
  [key: string]: any;
  id: string | number;
}
export interface SortableListProps extends Omit<FlexboxProps, 'onChange'> {
  items: SortableListItem[];
  onChange(items: SortableListItem[]): void;
  ref?: Ref<HTMLUListElement>;
  renderItem(item: SortableListItem): ReactNode;
}
