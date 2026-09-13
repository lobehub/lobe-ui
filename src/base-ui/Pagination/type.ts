import type { ComponentProps, ReactNode, Ref } from 'react';

export type PaginationSize = 'small' | 'middle';

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  current?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (current: number, size: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  ref?: Ref<HTMLElement>;
  showSizeChanger?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  size?: PaginationSize;
  total: number;
}
