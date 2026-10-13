import {
  type ColumnDef,
  createExpandedRowModel,
  type ExpandedState,
  rowExpandingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import {
  measureElement,
  observeElementRect,
  useVirtualizer,
  type Virtualizer,
} from '@tanstack/react-virtual';
import { type Key, useCallback, useMemo } from 'react';

import { getFixedInfo, getStickyOffsets } from './fixed';
import type {
  EngineColumn,
  HeaderCellModel,
  LeafColumnModel,
  RowModel,
  TableEngineInput,
  TableModel,
  VirtualInput,
  VirtualModel,
  VirtualScrollConfig,
} from './types';

const features = tableFeatures({
  expandedRowModel: createExpandedRowModel(),
  rowExpandingFeature,
});

type Features = typeof features;

const flattenLeaves = <C>(
  columns: readonly EngineColumn<C>[],
  inheritedFixed?: EngineColumn<C>['fixed'],
): EngineColumn<C>[] =>
  columns.flatMap((column) => {
    const fixed = column.fixed ?? inheritedFixed;
    if (column.children?.length) return flattenLeaves(column.children, fixed);
    return [{ ...column, fixed }];
  });

const toColumnDefs = <C>(columns: readonly EngineColumn<C>[]): ColumnDef<Features, any>[] =>
  columns.map((column) =>
    column.children?.length
      ? { columns: toColumnDefs(column.children), id: column.key, meta: column }
      : { id: column.key, meta: column },
  ) as ColumnDef<Features, any>[];

const useHeaderRows = <C>(
  table: { getHeaderGroups: () => any[] },
  columns: readonly EngineColumn<C>[],
  leaves: readonly EngineColumn<C>[],
  offsets: ReturnType<typeof getStickyOffsets>,
): HeaderCellModel<C>[][] =>
  useMemo(() => {
    const leafIndex = new Map(leaves.map((leaf, index) => [leaf.key, index]));
    const fixedByKey = new Map<string, EngineColumn<C>['fixed']>();
    const collectFixed = (list: readonly EngineColumn<C>[], inherited?: EngineColumn<C>['fixed']) =>
      list.forEach((column) => {
        const fixed = column.fixed ?? inherited;
        fixedByKey.set(column.key, fixed);
        if (column.children) collectFixed(column.children, fixed);
      });
    collectFixed(columns);

    return table.getHeaderGroups().map((group) =>
      group.headers.flatMap((header: any): HeaderCellModel<C>[] => {
        if (header.rowSpan === 0) return [];
        const column = header.column.columnDef.meta as EngineColumn<C>;
        const leafHeader = header.getLeafHeaders().find((leaf: any) => !leaf.subHeaders.length);
        const colStart = leafIndex.get(leafHeader?.column.id) ?? 0;
        const colSpan = column.headerColSpan ?? header.colSpan;
        if (colSpan === 0) return [];
        const colEnd = colStart + colSpan - 1;
        return [
          {
            colEnd,
            colSpan,
            colStart,
            column: { ...column, fixed: fixedByKey.get(column.key) },
            fixedInfo: getFixedInfo(colStart, colEnd, leaves, offsets),
            isLeaf: !column.children?.length,
            key: column.key,
            rowSpan: header.rowSpan,
          },
        ];
      }),
    );
  }, [table, columns, leaves, offsets]);

const useVirtualModel = <T>(
  virtual: VirtualInput | undefined,
  rows: readonly RowModel<T>[],
): VirtualModel | undefined => {
  const fallbackHeight = virtual?.initialHeight ?? 0;
  const observeRect = useCallback(
    (
      instance: Virtualizer<HTMLElement, Element>,
      callback: (rect: { height: number; width: number }) => void,
    ) =>
      observeElementRect(instance, (rect) =>
        callback({ height: rect.height || fallbackHeight, width: rect.width }),
      ),
    [fallbackHeight],
  );
  const virtualizer = useVirtualizer({
    count: virtual ? rows.length : 0,
    enabled: Boolean(virtual),
    estimateSize: () => virtual?.rowHeight ?? 0,
    measureElement: (element, entry, instance) =>
      measureElement(element, entry, instance) || (virtual?.rowHeight ?? 0),
    getItemKey: (index) => rows[index]?.key ?? index,
    getScrollElement: () => virtual?.getScrollElement() ?? null,
    initialRect: { height: virtual?.initialHeight ?? 0, width: 0 },
    observeElementRect: observeRect,
    overscan: virtual?.overscan ?? 6,
  });

  if (!virtual) return undefined;

  const scrollTo = ({ align = 'nearest', index, key, offset = 0, top }: VirtualScrollConfig) => {
    const element = virtual.getScrollElement();
    if (!element) return;
    if (typeof top === 'number') {
      element.scrollTop = top;
      return;
    }
    const target =
      key === undefined ? index : rows.findIndex((row) => String(row.key) === String(key));
    if (target === undefined || target < 0) return;
    const item = virtualizer.measurementsCache[target];
    if (!item) return;
    const viewport = element.clientHeight;
    let next = element.scrollTop;
    if (align === 'start') next = item.start;
    else if (align === 'end') next = item.end - viewport;
    else if (item.start < next) next = item.start;
    else if (item.end > next + viewport) next = item.end - viewport;
    element.scrollTop = Math.max(0, next + offset);
  };

  return {
    items: virtualizer.getVirtualItems().map((item) => ({
      index: item.index,
      key: item.key as Key,
      size: item.size,
      start: item.start,
    })),
    measureElement: virtualizer.measureElement,
    scrollTo,
    totalSize: virtualizer.getTotalSize(),
  };
};

export const useTableEngine = <T, C = unknown>({
  columnWidths,
  columns,
  data,
  expandedKeys,
  getChildren,
  getRowKey,
  virtual,
}: TableEngineInput<T, C>): TableModel<T, C> => {
  const columnDefs = useMemo(() => toColumnDefs(columns), [columns]);
  const leaves = useMemo(() => flattenLeaves(columns), [columns]);

  const expanded = useMemo(() => {
    const state: Record<string, boolean> = {};
    expandedKeys.forEach((key) => {
      state[String(key)] = true;
    });
    return state as ExpandedState;
  }, [expandedKeys]);

  const table = useTable(
    {
      columns: columnDefs,
      data: data as T[],
      features,
      getRowId: (record: T, index: number) => String(getRowKey(record, index)),
      getSubRows: getChildren
        ? (record: T) => {
            const children = getChildren(record);
            return children?.length ? children : undefined;
          }
        : undefined,
      state: { expanded },
    } as any,
    () => null,
  );

  const offsets = useMemo(() => getStickyOffsets(columnWidths, leaves), [columnWidths, leaves]);

  const leafColumns = useMemo(
    (): LeafColumnModel<C>[] =>
      leaves.map((column, index) => ({
        column,
        fixed: column.fixed,
        fixedInfo: getFixedInfo(index, index, leaves, offsets),
        index,
        key: column.key,
      })),
    [leaves, offsets],
  );

  const headerRows = useHeaderRows(table as any, columns, leaves, offsets);

  const coreRows = (table as any).getRowModel().rows as any[];
  const rows = useMemo(
    (): RowModel<T>[] =>
      coreRows.map((row, index) => {
        const key = getRowKey(row.original, row.index);
        return {
          depth: row.depth,
          expanded: expandedKeys.has(key),
          hasChildren: Boolean(getChildren?.(row.original)),
          index,
          key,
          record: row.original,
          renderIndex: row.index,
        };
      }),
    [coreRows, expandedKeys, getChildren, getRowKey],
  );

  const virtualModel = useVirtualModel(virtual, rows);

  return { headerRows, leafColumns, rows, virtual: virtualModel };
};
