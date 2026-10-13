'use client';

import {
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  use,
} from 'react';

import type { LeafColumnModel } from '../engine/types';
import type { ColumnSource } from '../pipeline/normalizeColumns';
import type { ExpandType } from '../pipeline/useExpandable';
import type { FilterKeys, FilterState } from '../pipeline/useFilter';
import type { MergedSelectionItem, SelectionActions } from '../pipeline/useSelection';
import type { SortState } from '../pipeline/useSorter';
import type { NormalizedSemantic } from '../semantic';
import type {
  SortOrder,
  TableColumn,
  TableColumnTitleProps,
  TableCustomizeComponent,
  TableExpandIconProps,
  TableLocale,
  TableRowClassName,
  TableRowSelection,
  TableRowSelectionCheckboxProps,
  TableSorterTooltipProps,
} from '../type';

export interface TableComponentSet {
  bodyCell?: TableCustomizeComponent;
  bodyRow?: TableCustomizeComponent;
  bodyWrapper?: TableCustomizeComponent;
  headerCell?: TableCustomizeComponent;
  headerRow?: TableCustomizeComponent;
  headerTable?: TableCustomizeComponent;
  headerWrapper?: TableCustomizeComponent;
  table?: TableCustomizeComponent;
}

export interface ExpandView<T> {
  expandedRowClassName?: string | TableRowClassName<T>;
  expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => ReactNode;
  expandIcon: (props: TableExpandIconProps<T>) => ReactNode;
  expandRowByClick?: boolean;
  forceRender?: boolean;
  indentSize: number;
  nestIconColumnIndex: number;
  rowExpandable?: (record: T) => boolean;
  toggle: (record: T, event?: unknown) => void;
  type: ExpandType;
}

export interface TableViewValue<T = any> {
  components: TableComponentSet;
  expand: ExpandView<T>;
  fixColumn: boolean;
  getRowKey: (record: T, index?: number) => Key;
  horizonScroll: boolean;
  leafColumns: LeafColumnModel<ColumnSource<T>>[];
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  prefixCls: string;
  rowClassName?: string | TableRowClassName<T>;
  rowHoverable: boolean;
  semanticClassNames: NormalizedSemantic<string>;
  semanticStyles: NormalizedSemantic<CSSProperties>;
  virtualWidths?: readonly number[];
}

export const TableViewContext = createContext<TableViewValue | null>(null);

export const useTableView = <T>() => use(TableViewContext) as TableViewValue<T>;

export interface SelectionView<T = any> {
  actions: SelectionActions;
  checkboxPropsMap: ReadonlyMap<Key, TableRowSelectionCheckboxProps>;
  expandType: ExpandType;
  getRowKey: (record: T, index?: number) => Key;
  getTitleCheckboxProps?: () => TableRowSelectionCheckboxProps;
  hideSelectAll?: boolean;
  locale: TableLocale;
  renderCell?: TableRowSelection<T>['renderCell'];
  selections: MergedSelectionItem[] | null;
  title?: TableRowSelection<T>['columnTitle'];
  type: 'checkbox' | 'radio';
}

export const SelectionContext = createContext<SelectionView | null>(null);

export const useSelectionView = <T>() => use(SelectionContext) as SelectionView<T>;

export interface HeaderView<T = any> {
  filterStates: readonly FilterState<T>[];
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  locale: TableLocale;
  onHeaderRow?: (
    columns: readonly TableColumn<T>[],
    index?: number,
  ) => HTMLAttributes<HTMLTableRowElement>;
  showSorterTooltip: boolean | TableSorterTooltipProps;
  sortDirections: SortOrder[];
  sortStates: readonly SortState<T>[];
  titleProps: TableColumnTitleProps<T>;
  triggerFilter: (columnKey: string, filteredKeys: FilterKeys) => void;
  triggerSort: (state: SortState<T>) => void;
}

export const HeaderContext = createContext<HeaderView | null>(null);

export const useHeaderView = <T>() => use(HeaderContext) as HeaderView<T>;

export const MeasureRowContext = createContext(false);

export interface VirtualCellValue {
  getHeight?: (rowSpan: number) => number;
  inverse: boolean;
}

export const VirtualCellContext = createContext<VirtualCellValue>({ inverse: false });
