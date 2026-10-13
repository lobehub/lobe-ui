import type { CSSProperties, ReactNode, Ref, RefObject, UIEventHandler } from 'react';

import type { TableRootProps } from '../atoms';
import type { StickyOffsets } from '../engine/fixed';
import type { HeaderCellModel, RowModel, VirtualModel } from '../engine/types';
import type { ColumnSource } from '../pipeline/normalizeColumns';

export interface StickyConfig {
  container: HTMLElement | Window;
  isSticky: boolean;
  offsetHeader: number;
  offsetScroll: number;
  offsetSummary: number;
}

export interface TableViewProps<T> extends Pick<
  TableRootProps,
  'grouped' | 'hoverable' | 'size' | 'variant'
> {
  bodyRef: RefObject<HTMLDivElement | null>;
  className?: string;
  colWidths: readonly number[];
  emptyNode: ReactNode;
  fixFooter: false | true | 'top' | 'bottom';
  fixHeader: boolean;
  footer?: ReactNode;
  headerRows: readonly HeaderCellModel<ColumnSource<T>>[][];
  offsets: StickyOffsets;
  onColumnResize: (key: string, width: number) => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  ref?: Ref<HTMLDivElement>;
  rows: readonly RowModel<T>[];
  scrollX?: number | string | true;
  scrollY?: number | string;
  showHeader: boolean;
  sticky: StickyConfig;
  style?: CSSProperties;
  summaryNode: ReactNode;
  tableLayout: 'auto' | 'fixed';
  title?: ReactNode;
  virtual?: VirtualModel;
}
