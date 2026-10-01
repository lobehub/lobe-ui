import type { CSSProperties, HTMLAttributes, Key, ReactNode, Ref, TdHTMLAttributes } from 'react';

export type SortOrder = 'ascend' | 'descend';

export type FilterValue = string | number | boolean;

export interface TableColumn<T> {
  align?: 'left' | 'center' | 'right';
  className?: string;
  dataIndex?: Extract<keyof T, string>;
  defaultSortOrder?: SortOrder;
  ellipsis?: boolean;
  filters?: { text: ReactNode; value: FilterValue }[];
  fixed?: 'left' | 'right';
  key?: Key;
  onCell?: (record: T, index: number) => TdHTMLAttributes<HTMLTableCellElement>;
  onFilter?: (value: FilterValue, record: T) => boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortDirections?: SortOrder[];
  sorter?: boolean | ((a: T, b: T) => number);
  title?: ReactNode;
  width?: number | string;
}

export interface TablePaginationConfig {
  current?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  total?: number;
}

export interface TableSorterResult<T> {
  column?: TableColumn<T>;
  columnKey?: Key;
  order?: SortOrder;
}

export type TableFilters = Record<string, FilterValue[] | null>;

export type TableSemanticName = 'body' | 'cell' | 'header' | 'row' | 'wrapper';

export interface TableProps<T> {
  bordered?: boolean;
  className?: string;
  classNames?: Partial<Record<TableSemanticName, string>>;
  columns: TableColumn<T>[];
  dataSource?: T[];
  emptyText?: ReactNode;
  loading?: boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: TableFilters,
    sorter: TableSorterResult<T>,
  ) => void;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  pagination?: false | TablePaginationConfig;
  ref?: Ref<HTMLDivElement>;
  rowClassName?: string | ((record: T, index: number) => string);
  rowKey: Extract<keyof T, string> | ((record: T) => Key);
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle';
  style?: CSSProperties;
  styles?: Partial<Record<TableSemanticName, CSSProperties>>;
  tableLayout?: 'auto' | 'fixed';
}
