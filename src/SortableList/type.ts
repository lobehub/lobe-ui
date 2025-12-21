import type { FlexboxProps } from '@lobehub/ui/Flex';
import { type ReactNode, Ref } from 'react';

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
