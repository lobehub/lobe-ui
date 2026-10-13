'use client';

import { type Key, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import { DEFAULT_INDENT_SIZE, PREFIX_CLS } from './constants';
import { useTableEngine } from './engine/useTableEngine';
import {
  assertColumnKeys,
  fillColumns,
  flattenColumns,
  isColumnGroup,
} from './pipeline/columnUtils';
import { convertChildrenToColumns } from './pipeline/convertChildrenToColumns';
import { normalizeColumns } from './pipeline/normalizeColumns';
import { isPlainObject } from './pipeline/selectionUtils';
import { useBreakpoint } from './pipeline/useBreakpoint';
import { getExpandType, useExpandable } from './pipeline/useExpandable';
import { useSelection } from './pipeline/useSelection';
import { useTableLocale } from './pipeline/useTableLocale';
import { useTableState } from './pipeline/useTableState';
import { useVirtualLayout } from './pipeline/useVirtualLayout';
import renderExpandIcon from './render/ExpandIcon';
import { createTableStore } from './store/createTableStore';
import type { TableProps, TableScrollToConfig } from './type';

const EMPTY_DATA: any[] = [];

const isPresent = (value: unknown) => value !== null && value !== undefined;

export const useTableController = <T>(props: TableProps<T>) => {
  const {
    children,
    column: columnDefaults,
    columns: columnsProp,
    dataSource = EMPTY_DATA as T[],
    expandable,
    locale,
    onChange,
    pagination,
    rowKey = 'key',
    rowSelection,
    scroll,
    size = 'middle',
    summary,
    variant = 'borderless',
    virtual,
  } = props;

  const tableLocale = useTableLocale(locale);

  const columns = useMemo(
    () => fillColumns(columnsProp ?? convertChildrenToColumns<T>(children), columnDefaults),
    [columnsProp, children, columnDefaults],
  );
  assertColumnKeys(columns);
  const grouped = useMemo(
    () => columns.some((column) => isColumnGroup(column) && column.children.length > 0),
    [columns],
  );
  const needResponsive = useMemo(
    () => flattenColumns(columns).some(({ column }) => column.responsive),
    [columns],
  );
  const screens = useBreakpoint(needResponsive);

  const childrenColumnName = expandable?.childrenColumnName ?? 'children';
  const getRowKey = useMemo(
    () =>
      typeof rowKey === 'function'
        ? rowKey
        : (record: T) => (record as Record<PropertyKey, unknown>)?.[rowKey as PropertyKey] as Key,
    [rowKey],
  );

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const engineScrollRef = useRef<((config: TableScrollToConfig) => void) | undefined>(undefined);
  const scrollTo = useEventCallback((config: TableScrollToConfig) => {
    engineScrollRef.current?.(config);
  });

  const state = useTableState({
    childrenColumnName,
    columns,
    dataSource,
    onChange,
    onTableChange: () => {
      if (scroll && scroll.scrollToFirstRowOnChange !== false) scrollTo({ top: 0 });
    },
    pagination,
  });
  const { data: allRows, page, total } = state;
  const { pageIndex, pageSize } = page;
  const rows = useMemo(() => {
    if (pagination === false) return allRows;
    if (allRows.length < total && allRows.length <= pageSize) return allRows;
    return allRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [allRows, pagination, pageIndex, pageSize, total]);

  const clientPaginated = pagination !== false && state.config?.total === undefined;
  const syncClampedPage = useEventCallback(() => state.clampPage(pageIndex));
  useLayoutEffect(() => {
    if (clientPaginated && pageIndex !== state.rawPageIndex) syncClampedPage();
  }, [clientPaginated, pageIndex, state.rawPageIndex, syncClampedPage]);

  const recordMap = useMemo(() => {
    const map = new Map<Key, T>();
    const dig = (records: readonly T[]) => {
      records.forEach((record, index) => {
        map.set(getRowKey(record, index), record);
        const nested = isPlainObject(record) ? record[childrenColumnName] : undefined;
        if (Array.isArray(nested)) dig(nested as T[]);
      });
    };
    dig(dataSource);
    return map;
  }, [dataSource, childrenColumnName, getRowKey]);
  const getRecordByKey = useCallback((key: Key) => recordMap.get(key), [recordMap]);

  const expandType = useMemo(
    () => getExpandType(rows, childrenColumnName, expandable),
    [rows, childrenColumnName, expandable],
  );
  const { expandedKeys, toggle } = useExpandable({
    childrenColumnName,
    expandable,
    getRowKey,
    pageData: rows,
  });

  const selection = useSelection(
    {
      childrenColumnName,
      data: allRows,
      expandType,
      getRecordByKey,
      getRowKey,
      locale: tableLocale,
      pageData: rows,
    },
    rowSelection,
  );

  const virtualDefaults = useVirtualLayout({ expandable, rowSelection, variant, virtual });

  const normalized = useMemo(
    () =>
      normalizeColumns(columns, {
        expandColumnWidth: expandable?.columnWidth ?? virtualDefaults.expandColumnWidth,
        expandType,
        expandable,
        prefixCls: PREFIX_CLS,
        rowSelection,
        screens,
        selectionColumnWidth: rowSelection?.columnWidth ?? virtualDefaults.selectionColumnWidth,
      }),
    [columns, expandable, expandType, rowSelection, screens, virtualDefaults],
  );

  const [colWidthMap, setColWidthMap] = useState<ReadonlyMap<string, number>>(new Map());
  const onColumnResize = useCallback((key: string, width: number) => {
    setColWidthMap((previous) => {
      if (previous.get(key) === width) return previous;
      const next = new Map(previous);
      next.set(key, width);
      return next;
    });
  }, []);

  const scrollX = scroll?.x;
  const fixHeader = Boolean(scroll && isPresent(scroll.y));
  const horizonScroll = Boolean(scroll && isPresent(scrollX)) || Boolean(expandable?.fixed);

  const { componentWidth, measureRef } = virtualDefaults;
  const virtualWidths = useMemo(
    () => (virtual ? virtualDefaults.fillWidths(normalized, scrollX, componentWidth) : undefined),
    [virtual, virtualDefaults, normalized, scrollX, componentWidth],
  );

  const leafKeys = useMemo(() => {
    const keys: string[] = [];
    const dig = (list: typeof normalized) =>
      list.forEach((column) =>
        column.children?.length ? dig(column.children) : keys.push(column.key),
      );
    dig(normalized);
    return keys;
  }, [normalized]);
  const columnWidths = useMemo(
    () => virtualWidths ?? leafKeys.map((key) => colWidthMap.get(key) ?? 0),
    [virtualWidths, leafKeys, colWidthMap],
  );

  const getChildren = useMemo(
    () =>
      expandType === 'nest'
        ? (record: T) =>
            (isPlainObject(record) ? record[childrenColumnName] : undefined) as T[] | undefined
        : undefined,
    [expandType, childrenColumnName],
  );

  const scrollY = scroll?.y;
  const model = useTableEngine({
    columnWidths,
    columns: normalized,
    data: rows,
    expandedKeys,
    getChildren,
    getRowKey,
    virtual: virtual
      ? {
          getScrollElement: () => bodyRef.current,
          initialHeight: typeof scrollY === 'number' ? scrollY : undefined,
          rowHeight: virtualDefaults.rowHeight(size),
        }
      : undefined,
  });

  engineScrollRef.current = (config) => {
    if (model.virtual) {
      model.virtual.scrollTo(config);
      return;
    }
    const body = bodyRef.current;
    if (!body) return;
    const { align = 'nearest', index, key, offset, top } = config;
    if (typeof top === 'number') {
      body.scrollTo?.({ top });
      return;
    }
    const target = key ?? (index === undefined ? undefined : getRowKey(rows[index], index));
    const element = body.querySelector<HTMLElement>(`[data-row-key="${target}"]`);
    if (!element) return;
    element.scrollIntoView({ block: align });
    if (offset) body.scrollTo?.({ top: body.scrollTop + offset });
  };

  const [store] = useState(() =>
    createTableStore({
      expandedKeys,
      halfSelectedKeys: selection.halfSelectedKeySet,
      selectedKeys: selection.selectedKeySet,
      selectionSummary: selection.summary,
    }),
  );
  const sortedColumns = useMemo(
    () => new Set(state.sortStates.filter(({ sortOrder }) => sortOrder).map(({ key }) => key)),
    [state.sortStates],
  );
  useLayoutEffect(() => {
    store.setState({
      expandedKeys,
      halfSelectedKeys: selection.halfSelectedKeySet,
      selectedKeys: selection.selectedKeySet,
      selectionSummary: selection.summary,
      sortedColumns,
    });
  });

  const nestIconColumnIndex = (() => {
    const index = expandable?.expandIconColumnIndex;
    if (expandType === 'nest' && index === undefined) return rowSelection ? 1 : 0;
    if ((index ?? 0) > 0 && rowSelection) return index! - 1;
    return index ?? 0;
  })();

  const expandIcon = useMemo(
    () =>
      expandable?.expandIcon ??
      ((iconProps: Parameters<typeof renderExpandIcon<T>>[0]) =>
        renderExpandIcon(iconProps, tableLocale)),
    [expandable?.expandIcon, tableLocale],
  );

  const summaryNode = useMemo(() => summary?.(rows), [summary, rows]);

  return {
    bodyRef,
    columnWidths,
    columns,
    expandIcon,
    expandType,
    fixHeader,
    getRowKey,
    grouped,
    horizonScroll,
    indentSize:
      typeof expandable?.indentSize === 'number' ? expandable.indentSize : DEFAULT_INDENT_SIZE,
    measureRef,
    model,
    nestIconColumnIndex,
    onColumnResize,
    rows,
    screens,
    scrollTo,
    selection,
    state,
    store,
    summaryNode,
    tableLocale,
    toggleExpand: toggle,
    virtualWidths,
  };
};
