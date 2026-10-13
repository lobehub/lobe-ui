import type { Key } from 'react';

export type EngineFixed = 'start' | 'end';

export interface EngineColumn<C = unknown> {
  children?: EngineColumn<C>[];
  fixed?: EngineFixed;
  headerColSpan?: number;
  key: string;
  source: C;
  width?: number | string;
}

export interface FixedInfo {
  fixEnd?: number;
  fixStart?: number;
  offsetFixedEndShadow: number;
  offsetFixedStartShadow: number;
  shadowEnd: boolean;
  shadowStart: boolean;
  zIndex: number;
  zIndexReverse: number;
}

export interface LeafColumnModel<C = unknown> {
  column: EngineColumn<C>;
  fixed?: EngineFixed;
  fixedInfo: FixedInfo;
  index: number;
  key: string;
}

export interface HeaderCellModel<C = unknown> {
  colEnd: number;
  colSpan: number;
  colStart: number;
  column: EngineColumn<C>;
  fixedInfo: FixedInfo;
  isLeaf: boolean;
  key: string;
  rowSpan: number;
}

export interface RowModel<T> {
  depth: number;
  expanded: boolean;
  hasChildren: boolean;
  index: number;
  key: Key;
  record: T;
  renderIndex: number;
}

export interface VirtualItem {
  index: number;
  key: Key;
  size: number;
  start: number;
}

export interface VirtualScrollConfig {
  align?: 'start' | 'end' | 'nearest';
  index?: number;
  key?: Key;
  offset?: number;
  top?: number;
}

export interface VirtualModel {
  items: VirtualItem[];
  measureElement: (element: Element | null) => void;
  scrollTo: (config: VirtualScrollConfig) => void;
  totalSize: number;
}

export interface VirtualInput {
  getScrollElement: () => HTMLElement | null;
  overscan?: number;
  rowHeight: number;
}

export interface TableEngineInput<T, C = unknown> {
  columns: readonly EngineColumn<C>[];
  columnWidths: readonly number[];
  data: readonly T[];
  expandedKeys: ReadonlySet<Key>;
  getChildren?: (record: T) => readonly T[] | undefined;
  getRowKey: (record: T, index: number) => Key;
  virtual?: VirtualInput;
}

export interface TableModel<T, C = unknown> {
  headerRows: HeaderCellModel<C>[][];
  leafColumns: LeafColumnModel<C>[];
  rows: RowModel<T>[];
  virtual?: VirtualModel;
}
