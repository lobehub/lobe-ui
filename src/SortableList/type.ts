import type { ReactNode, Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface SortableListItem {
  [key: string]: any;
  id: string | number;
}
export interface SortableListProps<T extends SortableListItem = SortableListItem> extends Omit<
  FlexboxProps,
  'onChange'
> {
  items: T[];
  onChange: (items: T[]) => void;
  ref?: Ref<HTMLUListElement>;
  renderItem: (item: T) => ReactNode;
  /**
   * Custom render function for the drag overlay
   * If not provided, renderItem will be used
   */
  renderOverlay?: (item: T) => ReactNode;
}
