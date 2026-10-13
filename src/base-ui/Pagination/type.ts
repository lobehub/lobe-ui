import type { ComponentProps, ComponentType, CSSProperties, ReactNode, Ref } from 'react';

import type { SelectProps } from '@/base-ui/Select/type';

export type PaginationSize = 'small' | 'middle';

/** antd `PaginationSemanticType`: `root` is the `<nav>`, `item` each page-number button. */
export type PaginationSemanticName = 'item' | 'root';

/** antd `itemRender` item types: `jump-prev` / `jump-next` are the ellipses. */
export type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

export type PaginationAlign = 'start' | 'center' | 'end';

/** Extra props of the page-size `Select` when `showSizeChanger` is an object. */
export interface PaginationSizeChangerProps extends Omit<
  SelectProps,
  'mode' | 'onChange' | 'options' | 'value'
> {
  onChange?: (value: string) => void;
}

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  /** Lays the pager out as a full-width row aligned to `start`, `center` or `end`. */
  align?: PaginationAlign;
  classNames?: Partial<Record<PaginationSemanticName, string>>;
  /** Replaces the page-size `Select`; it receives the same props. */
  components?: { sizeChanger?: ComponentType<any> };
  current?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  /** Custom content of each item; `element` is the default content. */
  itemRender?: (page: number, type: PaginationItemType, element: ReactNode) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (current: number, size: number) => void;
  pageSize?: number;
  /** @default [10, 20, 50, 100] */
  pageSizeOptions?: (number | string)[];
  ref?: Ref<HTMLElement>;
  /** Use the `small` size on extra-small screens (< 576px) when `size` is not set. */
  responsive?: boolean;
  /** Show one page on each side of the current page instead of two. */
  showLessItems?: boolean;
  /** Show a "Go to" page input; `goButton` adds a confirm button (the input then applies on Enter or the button only). */
  showQuickJumper?: boolean | { goButton?: ReactNode };
  /** Defaults to `true` when `total` is greater than `totalBoundaryShowSizeChanger`. */
  showSizeChanger?: boolean | PaginationSizeChangerProps;
  /** Show native `title` tooltips on the items. @default true */
  showTitle?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  /** Compact `prev [current] / pages next` mode; `readOnly` shows the current page as text. */
  simple?: boolean | { readOnly?: boolean };
  size?: PaginationSize;
  styles?: Partial<Record<PaginationSemanticName, CSSProperties>>;
  total: number;
  /** `total` above which `showSizeChanger` defaults to on. @default 50 */
  totalBoundaryShowSizeChanger?: number;
}
