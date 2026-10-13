'use client';

import RcTable, {
  type ColumnsType as RcColumnsType,
  convertChildrenToColumns,
  EXPAND_COLUMN,
  type ExpandableConfig as RcExpandableConfig,
  INTERNAL_HOOKS,
  type Reference as RcReference,
  Summary,
  VirtualTable as RcVirtualTable,
} from '@rc-component/table';
import { cx } from 'antd-style';
import { ArrowDownFromLine, ArrowUpDown, ArrowUpToLine } from 'lucide-react';
import {
  type HTMLAttributes,
  type Key,
  memo,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import Pagination, { type PaginationAlign } from '@/base-ui/Pagination';
import Spin from '@/base-ui/Spin';
import Tooltip from '@/base-ui/Tooltip';
import Empty from '@/Empty';
import { useEventCallback } from '@/hooks/useEventCallback';
import tableMessages from '@/i18n/resources/en/table';
import { useTranslation } from '@/i18n/useTranslation';

import Column from './Column';
import ColumnGroup from './ColumnGroup';
import {
  assertColumnKeys,
  fillColumns,
  flattenColumns,
  getColumnId,
  getColumnPos,
  isColumnGroup,
  isColumnVisibleAt,
  renderColumnTitle,
} from './columnUtils';
import renderExpandIcon from './ExpandIcon';
import FilterDropdown, { TableMeasureRowContext } from './FilterDropdown';
import {
  isPlainObject,
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './selectionUtils';
import { normalizeClassNames, normalizeStyles, resolveSemantic } from './semantic';
import {
  EXPAND_COLUMN_WIDTH,
  PREFIX_CLS,
  SELECTION_COLUMN_WIDTH,
  SELECTION_DROPDOWN_WIDTH,
  styles,
} from './style';
import type {
  SortOrder,
  TableColumn,
  TableColumnType,
  TableLocale,
  TableProps,
  TableRef,
  TableScrollToConfig,
  TableSize,
  TableSorterTooltipProps,
} from './type';
import { useBreakpoint } from './useBreakpoint';
import { useSelection } from './useSelection';
import { DEFAULT_SORT_DIRECTIONS, getMultiplePriority, getNextSortOrder } from './useSorter';
import { useTableState } from './useTableState';

const EMPTY_DATA: any[] = [];
const DEFAULT_INDENT_SIZE = 15;
const DEFAULT_SORTER_TOOLTIP: TableSorterTooltipProps = { target: 'full-header' };

/**
 * Estimated `virtual` row height per size, like antd: padding × 2 + 14px × 22/14 line + 1px border.
 * rc-virtual-list still measures the real rows; this only seeds the scroll range.
 */
const VIRTUAL_ROW_HEIGHT: Record<TableSize, number> = {
  large: 16 * 2 + 22 + 1,
  medium: 12 * 2 + 22 + 1,
  middle: 12 * 2 + 22 + 1,
  small: 8 * 2 + 22 + 1,
};

const sizeClassName: Record<TableSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  middle: styles.sizeMedium,
  small: styles.sizeSmall,
};

const sortTipOf = (next: SortOrder | undefined, locale: TableLocale) =>
  next === 'descend'
    ? locale.triggerDesc
    : next === 'ascend'
      ? locale.triggerAsc
      : locale.cancelSort;

const ariaSortOf = (order: SortOrder | undefined) =>
  order === 'ascend' ? 'ascending' : order === 'descend' ? 'descending' : 'none';

const paginationAlignClassName: Record<PaginationAlign, string> = {
  center: styles.paginationCenter,
  end: styles.paginationEnd,
  start: styles.paginationStart,
};

/** antd `normalizePlacement`: `topLeft` / `bottomStart` → `start`, `*Center` → `center`, else `end`. */
const normalizePlacement = (placement: string): PaginationAlign => {
  const lower = placement.toLowerCase();
  if (lower.includes('center')) return 'center';
  return lower.includes('left') || lower.includes('start') ? 'start' : 'end';
};

// Only a static filter trigger renders in rc-table's hidden measure row, like antd.
const wrapMeasureRow = (measureRow: ReactNode) => (
  <TableMeasureRowContext value={true}>{measureRow}</TableMeasureRowContext>
);

/** antd's ref shape: the root element itself, extended with `nativeElement` and `scrollTo`. */
const toTableRef = (
  element: HTMLDivElement,
  scrollTo: (config: TableScrollToConfig) => void,
): TableRef => {
  const extra = { nativeElement: element, scrollTo };
  return new Proxy(element, {
    get(target, prop) {
      if (prop in extra) return extra[prop as keyof typeof extra];
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as TableRef;
};

const TableInner = <T,>(props: TableProps<T>) => {
  const {
    variant = 'borderless',
    children,
    childrenColumnName: legacyChildrenColumnName,
    className,
    classNames,
    column: columnDefaults,
    columns: columnsProp,
    components,
    dataSource = EMPTY_DATA as T[],
    emptyText,
    expandable,
    expandedRowRender: legacyExpandedRowRender,
    expandIcon: legacyExpandIcon,
    expandIconColumnIndex: legacyExpandIconColumnIndex,
    footer,
    getPopupContainer,
    indentSize: legacyIndentSize,
    loading = false,
    locale,
    measureRowRender,
    onChange,
    onHeaderRow,
    onRow,
    onScroll,
    pagination,
    ref,
    rootClassName,
    rowClassName,
    rowHoverable = true,
    rowKey = 'key',
    rowSelection,
    scroll,
    showHeader,
    showSorterTooltip: tableShowSorterTooltip = DEFAULT_SORTER_TOOLTIP,
    size: sizeProp,
    sortDirections: tableSortDirections = DEFAULT_SORT_DIRECTIONS,
    sticky,
    style,
    styles: customStyles,
    summary,
    tableLayout,
    title,
    virtual,
  } = props;
  const size: TableSize = sizeProp ?? 'middle';

  // =============================== Locale ===============================
  const { t } = useTranslation(tableMessages);
  const tableLocale = useMemo(
    (): TableLocale => ({
      cancelSort: t('table.cancelSort'),
      collapse: t('table.collapse'),
      expand: t('table.expand'),
      filterCheckAll: t('table.filterCheckAll'),
      filterConfirm: t('table.filterConfirm'),
      filterEmptyText: t('table.filterEmptyText'),
      filterReset: t('table.filterReset'),
      filterSearchPlaceholder: t('table.filterSearchPlaceholder'),
      filterTitle: t('table.filterTitle'),
      selectAll: t('table.selectAll'),
      selectInvert: t('table.selectInvert'),
      selectNone: t('table.selectNone'),
      selectionAll: t('table.selectionAll'),
      sortTitle: t('table.sortTitle'),
      triggerAsc: t('table.triggerAsc'),
      triggerDesc: t('table.triggerDesc'),
      ...(locale?.filterCheckall !== undefined && { filterCheckAll: locale.filterCheckall }),
      ...locale,
    }),
    [t, locale],
  );

  // ============================ Semantic DOM ============================
  const semanticInfo = { props };
  const mergedClassNames = normalizeClassNames(resolveSemantic(classNames, semanticInfo));
  const mergedStyles = normalizeStyles(resolveSemantic(customStyles, semanticInfo));

  const rawColumns = useMemo(
    () => columnsProp ?? (convertChildrenToColumns(children) as TableColumn<T>[]),
    [columnsProp, children],
  );
  const columns = useMemo(
    () => fillColumns(rawColumns, columnDefaults),
    [rawColumns, columnDefaults],
  );

  assertColumnKeys(columns);

  const needResponsive = useMemo(
    () => flattenColumns(columns).some(({ column }) => column.responsive),
    [columns],
  );
  const screens = useBreakpoint(needResponsive);

  // ============================= Expandable =============================
  const hasRowSelection = Boolean(rowSelection);
  const childrenColumnName =
    expandable?.childrenColumnName ?? legacyChildrenColumnName ?? 'children';
  const expandType = useMemo(() => {
    if (dataSource.some((record) => isPlainObject(record) && record[childrenColumnName])) {
      return 'nest';
    }
    if (legacyExpandedRowRender || expandable?.expandedRowRender) return 'row';
    return null;
  }, [childrenColumnName, dataSource, legacyExpandedRowRender, expandable?.expandedRowRender]);

  // Like antd: legacy top-level props sit under `expandable`, which always wins.
  const mergedExpandable = useMemo((): RcExpandableConfig<any> => {
    const config: RcExpandableConfig<any> = {
      childrenColumnName: legacyChildrenColumnName,
      expandedRowRender: legacyExpandedRowRender,
      expandIconColumnIndex: legacyExpandIconColumnIndex,
      ...(expandable as RcExpandableConfig<any>),
      expandIcon: (expandable?.expandIcon ??
        legacyExpandIcon ??
        ((iconProps: any) => renderExpandIcon(iconProps, tableLocale))) as any,
    };
    // Like antd: tree toggles sit after the selection column; legacy indexes skip it.
    if (expandType === 'nest' && config.expandIconColumnIndex === undefined) {
      config.expandIconColumnIndex = hasRowSelection ? 1 : 0;
    } else if ((config.expandIconColumnIndex ?? 0) > 0 && hasRowSelection) {
      config.expandIconColumnIndex = config.expandIconColumnIndex! - 1;
    }
    // Virtual rows are flex boxes sized from numeric widths; the CSS `col` width never reaches them.
    if (virtual && config.columnWidth === undefined) config.columnWidth = EXPAND_COLUMN_WIDTH;
    if (typeof config.indentSize !== 'number') {
      config.indentSize =
        typeof legacyIndentSize === 'number' ? legacyIndentSize : DEFAULT_INDENT_SIZE;
    }
    return config;
  }, [
    expandable,
    legacyChildrenColumnName,
    legacyExpandedRowRender,
    legacyExpandIcon,
    legacyExpandIconColumnIndex,
    legacyIndentSize,
    expandType,
    hasRowSelection,
    virtual,
    tableLocale,
  ]);

  // ================================ Refs ================================
  const rootRef = useRef<HTMLDivElement>(null);
  const rcRef = useRef<RcReference>(null);
  useImperativeHandle(
    ref as Ref<TableRef>,
    () => toTableRef(rootRef.current!, (config) => rcRef.current?.scrollTo(config)),
    [],
  );

  // ======================== Sort / Filter / Page ========================
  const state = useTableState({
    childrenColumnName,
    columns,
    dataSource,
    onChange,
    // Like antd: on by default once `scroll` is set.
    onTableChange: () => {
      if (scroll && scroll.scrollToFirstRowOnChange !== false) rcRef.current?.scrollTo({ top: 0 });
    },
    pagination,
  });
  const {
    config: paginationConfig,
    data: allRows,
    filterStates,
    page,
    sortStates,
    titleProps,
  } = state;
  const { pageIndex, pageSize } = page;
  const { total } = state;

  // Like antd: async data (fewer rows than `total`, at most one page) is shown as given.
  const rows = useMemo(() => {
    if (pagination === false) return allRows;
    if (allRows.length < total && allRows.length <= pageSize) return allRows;
    return allRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [allRows, pagination, pageIndex, pageSize, total]);

  // ============================== Selection ==============================
  const getRowKey = useMemo(
    () =>
      typeof rowKey === 'function'
        ? rowKey
        : (record: T) => (record as Record<PropertyKey, unknown>)?.[rowKey as PropertyKey] as Key,
    [rowKey],
  );
  const recordMap = useMemo(() => {
    const map = new Map<Key, T>();
    const dig = (records: readonly T[]) => {
      records.forEach((record, index) => {
        map.set(getRowKey(record, index), record);
        const children = isPlainObject(record) ? record[childrenColumnName] : undefined;
        if (Array.isArray(children)) dig(children as T[]);
      });
    };
    dig(dataSource);
    return map;
  }, [dataSource, childrenColumnName, getRowKey]);
  const getRecordByKey = useCallback((key: Key) => recordMap.get(key), [recordMap]);
  // Same as the expand column: give virtual rows the selection column's CSS width as a number.
  const mergedRowSelection = useMemo(() => {
    if (!virtual || !rowSelection || rowSelection.columnWidth !== undefined) return rowSelection;
    const withDropdown = Boolean(rowSelection.selections) && rowSelection.type !== 'radio';
    return {
      ...rowSelection,
      columnWidth:
        SELECTION_COLUMN_WIDTH +
        (withDropdown ? SELECTION_DROPDOWN_WIDTH : 0) +
        (variant === 'outlined' ? 16 : 0),
    };
  }, [virtual, rowSelection, variant]);
  const [transformSelectionColumns, selectedKeySet] = useSelection<T>(
    {
      childrenColumnName,
      data: allRows,
      expandType,
      getRecordByKey,
      getRowKey,
      locale: tableLocale,
      pageData: rows,
    },
    mergedRowSelection,
  );
  const mergedRowClassName = useCallback(
    (record: T, index: number, indent: number) =>
      cx(
        selectedKeySet.has(getRowKey(record, index)) && `${PREFIX_CLS}-row-selected`,
        typeof rowClassName === 'function' ? rowClassName(record, index, indent) : rowClassName,
      ),
    [selectedKeySet, getRowKey, rowClassName],
  );

  const clientPaginated = pagination !== false && paginationConfig?.total === undefined;
  const syncClampedPage = useEventCallback(() => state.clampPage(pageIndex));

  useEffect(() => {
    if (clientPaginated && pageIndex !== state.rawPageIndex) syncClampedPage();
  }, [clientPaginated, pageIndex, state.rawPageIndex, syncClampedPage]);

  // ============================== Loading ===============================
  const {
    spinning: isLoading = true,
    tip,
    ...spinProps
  } = typeof loading === 'object' ? loading : { spinning: loading };

  // =============================== Columns ==============================
  const triggerSort = useEventCallback(state.triggerSort);
  const triggerFilter = useEventCallback(state.triggerFilter);

  const rcColumns = useMemo(() => {
    const transform = (list: readonly TableColumn<T>[], parentPos?: string): RcColumnsType<any> =>
      list.flatMap((column, index) => {
        // The placeholders must reach rc-table by identity.
        if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) return [column];
        // Positions (and so fallback ids) come from the full tree, before responsive filtering.
        const pos = getColumnPos(index, parentPos);
        if (!isColumnVisibleAt(column, screens)) return [];

        const id = getColumnId(column, pos);
        const {
          defaultFilteredValue: _defaultFilteredValue,
          defaultSortOrder: _defaultSortOrder,
          filterDropdown,
          filterDropdownOpen: _filterDropdownOpen,
          filterDropdownProps: _filterDropdownProps,
          filtered: _filtered,
          filteredValue: _filteredValue,
          filterIcon: _filterIcon,
          filterMode: _filterMode,
          filterMultiple: _filterMultiple,
          filterOnClose: _filterOnClose,
          filterResetToDefaultFilteredValue: _filterResetToDefaultFilteredValue,
          filters: columnFilters,
          filterSearch: _filterSearch,
          onFilter: _onFilter,
          onFilterDropdownOpenChange: _onFilterDropdownOpenChange,
          onHeaderCell,
          responsive: _responsive,
          showSorterTooltip: columnShowSorterTooltip,
          sortDirections: columnSortDirections,
          sortIcon,
          sortOrder: _sortOrder,
          sorter,
          title: columnTitle,
          ...rest
        } = column as TableColumnType<T>;
        const order = sorter ? sortStates.find(({ key }) => key === id)?.sortOrder : undefined;

        const titleNode = renderColumnTitle(columnTitle, titleProps);
        const titleText =
          typeof titleNode === 'string' || typeof titleNode === 'number'
            ? String(titleNode)
            : undefined;
        // A single-text wrapper lets rc-table derive the header `title` and truncate it.
        const titleContent = column.ellipsis ? (
          <span className={cx(styles.columnTitle, `${PREFIX_CLS}-column-title`)}>{titleNode}</span>
        ) : (
          titleNode
        );

        const filterNode =
          columnFilters || filterDropdown ? (
            <FilterDropdown<T>
              column={column as TableColumnType<T>}
              columnKey={id}
              filterState={filterStates.find(({ key }) => key === id)}
              getPopupContainer={getPopupContainer}
              label={titleText ?? id}
              locale={tableLocale}
              triggerFilter={triggerFilter}
            />
          ) : null;
        const hasControls = Boolean(sorter) || Boolean(filterNode);

        let sorterNode: ReactNode = null;
        if (sorter) {
          const sortDirections = columnSortDirections ?? tableSortDirections;
          const nextOrder = getNextSortOrder(sortDirections, order);
          const showTooltip = columnShowSorterTooltip ?? tableShowSorterTooltip;
          const { target, ...tooltipOptions } =
            typeof showTooltip === 'object' ? showTooltip : ({} as TableSorterTooltipProps);
          const tooltipProps = { title: sortTipOf(nextOrder, tableLocale), ...tooltipOptions };
          const withTooltip = (node: ReactNode) => <Tooltip {...tooltipProps}>{node}</Tooltip>;

          const iconOnlyTooltip = Boolean(showTooltip) && target === 'sorter-icon';
          const onSort = () =>
            triggerSort({
              column,
              key: id,
              multiplePriority: getMultiplePriority(column),
              sortOrder: nextOrder,
            });
          // ActionIcon owns the click (same as the filter trigger). The title stays a plain
          // span so we never nest a button inside a button; clicking the title still sorts.
          const sortAction = (
            <ActionIcon
              active={Boolean(order)}
              className={cx(styles.sortCaret, `${PREFIX_CLS}-column-sorter`)}
              data-order={order ?? undefined}
              size="small"
              icon={
                sortIcon
                  ? sortIcon({ sortOrder: order ?? null })
                  : order === 'ascend'
                    ? ArrowUpToLine
                    : order === 'descend'
                      ? ArrowDownFromLine
                      : ArrowUpDown
              }
              {...(iconOnlyTooltip && showTooltip
                ? { title: tooltipProps.title, tooltipProps: tooltipOptions }
                : {})}
              onClick={(event) => {
                event.stopPropagation();
                onSort();
              }}
            />
          );
          const group = (
            <span
              className={cx(styles.sortButton, `${PREFIX_CLS}-column-sorters`)}
              // Without a tooltip, the native title still says the header sorts.
              title={showTooltip ? undefined : tableLocale.sortTitle}
            >
              <span className={styles.sortTitle} onClick={onSort}>
                {titleContent}
              </span>
              {sortAction}
            </span>
          );
          sorterNode = showTooltip && !iconOnlyTooltip ? withTooltip(group) : group;
        }

        return {
          ...rest,
          className: cx(
            rest.className,
            order ? [`${PREFIX_CLS}-column-sort`, styles.sortedColumn] : undefined,
          ),
          children: isColumnGroup(column) ? transform(column.children, pos) : undefined,
          key: id,
          onHeaderCell: () => {
            const cell = onHeaderCell?.(column);
            return {
              ...(sorter && { 'aria-sort': ariaSortOf(order) }),
              ...(column.ellipsis && hasControls && titleText && { title: titleText }),
              ...cell,
              className: cx(sorter && `${PREFIX_CLS}-column-has-sorters`, cell?.className),
            };
          },
          title: hasControls ? (
            <span className={styles.headerInner}>
              {sorterNode ?? titleContent}
              {filterNode}
            </span>
          ) : (
            titleContent
          ),
        };
      }) as RcColumnsType<any>;

    return transform(columns);
  }, [
    columns,
    screens,
    sortStates,
    filterStates,
    titleProps,
    getPopupContainer,
    triggerFilter,
    triggerSort,
    tableSortDirections,
    tableShowSorterTooltip,
    tableLocale,
  ]);

  // ============================== Rows ==============================
  const mergedOnRow = useMemo(
    () =>
      (record: T, index?: number): HTMLAttributes<HTMLElement> => {
        const rowProps = onRow?.(record, index ?? 0) ?? {};
        return {
          ...rowProps,
          className: cx(rowProps.onClick && styles.clickable, rowProps.className),
        };
      },
    [onRow],
  );

  // antd defaults to `fixed` layout once a column is pinned; `max-content` keeps sizing to content.
  const hasFixedColumn = useMemo(
    () =>
      Boolean(rowSelection?.fixed) ||
      flattenColumns(columns).some(({ column }) => column.fixed && !column.hidden),
    [columns, rowSelection?.fixed],
  );
  const mergedTableLayout =
    tableLayout ?? (hasFixedColumn && scroll?.x !== 'max-content' ? 'fixed' : undefined);

  // ============================= Pagination =============================
  let topPagination: ReactNode = null;
  let bottomPagination: ReactNode = null;
  if (paginationConfig && total > 0) {
    const {
      current: _current,
      defaultCurrent: _defaultCurrent,
      defaultPageSize: _defaultPageSize,
      onChange: _onChange,
      onShowSizeChange: _onShowSizeChange,
      pageSize: _pageSize,
      placement,
      position,
      total: _total,
      className: paginationClassName,
      classNames: paginationClassNames,
      size: paginationSize,
      styles: paginationStyles,
      ...paginationRest
    } = paginationConfig;
    const pageCount = Math.ceil(total / pageSize);
    const renderPagination = (align: PaginationAlign, side: 'top' | 'bottom') => (
      <div
        className={cx(
          styles.pagination,
          side === 'top' && styles.paginationTop,
          paginationAlignClassName[align],
          `${PREFIX_CLS}-pagination-wrapper`,
        )}
      >
        <Pagination
          {...paginationRest}
          current={pageIndex + 1}
          pageSize={pageSize}
          // Like antd: `small` / `medium` tables get a small pager unless one is set.
          size={paginationSize ?? (sizeProp && sizeProp !== 'large' ? 'small' : undefined)}
          total={total}
          className={cx(
            `${PREFIX_CLS}-pagination`,
            `${PREFIX_CLS}-pagination-${align}`,
            paginationClassName,
          )}
          classNames={{
            item: cx(mergedClassNames.pagination.item, paginationClassNames?.item),
            root: cx(mergedClassNames.pagination.root, paginationClassNames?.root),
          }}
          styles={{
            item: { ...paginationStyles?.item, ...mergedStyles.pagination.item },
            root: { ...paginationStyles?.root, ...mergedStyles.pagination.root },
          }}
          onChange={(next, nextPageSize) =>
            state.onPaginationChange({ pageIndex: next - 1, pageSize: nextPageSize })
          }
        />
      </div>
    );

    if (!(paginationRest.hideOnSinglePage && pageCount <= 1)) {
      const mergedPlacement = placement ?? position;
      if (Array.isArray(mergedPlacement)) {
        const find = (side: string) =>
          (mergedPlacement as string[]).find((item) => item.includes(side));
        const top = find('top');
        const bottom = find('bottom');
        const none = mergedPlacement.every((item) => item === 'none');
        if (top) topPagination = renderPagination(normalizePlacement(top), 'top');
        if (bottom) bottomPagination = renderPagination(normalizePlacement(bottom), 'bottom');
        if (!top && !bottom && !none) bottomPagination = renderPagination('end', 'bottom');
      } else {
        bottomPagination = renderPagination('end', 'bottom');
      }
    }
  }

  // Like antd: `locale.emptyText` (here also the `emptyText` alias) replaces the default empty state.
  const customEmpty = locale?.emptyText ?? emptyText;
  const emptyNode = isLoading ? (
    <Spin {...spinProps} />
  ) : customEmpty === undefined ? (
    <Empty description={t('table.emptyText')} />
  ) : typeof customEmpty === 'function' ? (
    customEmpty()
  ) : (
    customEmpty
  );

  // Like antd: `virtual` swaps in rc-table's VirtualTable (rc-virtual-list body).
  const TableComponent = (virtual ? RcVirtualTable : RcTable) as typeof RcTable;

  return (
    <div
      ref={rootRef}
      style={{ ...mergedStyles.root, ...style }}
      className={cx(
        styles.root,
        `${PREFIX_CLS}-wrapper`,
        rootClassName,
        className,
        mergedClassNames.root,
      )}
    >
      {topPagination}
      <div className={styles.spinContainer} data-table-wrapper="">
        <TableComponent<any>
          {...(virtual && { listItemHeight: VIRTUAL_ROW_HEIGHT[size] })}
          columns={rcColumns}
          components={components as any}
          data={rows as any[]}
          emptyText={emptyNode}
          expandable={mergedExpandable}
          footer={footer as any}
          internalHooks={INTERNAL_HOOKS}
          prefixCls={PREFIX_CLS}
          ref={rcRef}
          rowClassName={mergedRowClassName as any}
          rowHoverable={rowHoverable}
          rowKey={rowKey as string | ((record: T) => Key)}
          scroll={scroll}
          showHeader={showHeader}
          sticky={sticky}
          summary={summary as any}
          tableLayout={mergedTableLayout}
          title={title as any}
          transformColumns={transformSelectionColumns}
          className={cx(
            styles.table,
            sizeClassName[size],
            `${PREFIX_CLS}-${size === 'middle' ? 'medium' : size}`,
            variant === 'outlined' && styles.outlined,
            variant === 'filled' && styles.filled,
            `${PREFIX_CLS}-${variant}`,
            rowHoverable && styles.hoverable,
          )}
          classNames={{
            body: mergedClassNames.body,
            content: mergedClassNames.content,
            footer: mergedClassNames.footer,
            header: mergedClassNames.header,
            section: mergedClassNames.section,
            title: mergedClassNames.title,
          }}
          measureRowRender={(measureRow) =>
            wrapMeasureRow(measureRowRender ? measureRowRender(measureRow) : measureRow)
          }
          styles={{
            body: mergedStyles.body,
            content: mergedStyles.content,
            footer: mergedStyles.footer,
            header: mergedStyles.header,
            section: mergedStyles.section,
            title: mergedStyles.title,
          }}
          onHeaderRow={onHeaderRow as any}
          onRow={mergedOnRow as any}
          onScroll={onScroll}
        />
        {isLoading && rows.length > 0 && (
          <div className={styles.loading} data-table-loading="">
            <Spin {...spinProps} />
            {tip}
          </div>
        )}
      </div>
      {bottomPagination}
    </div>
  );
};

type TableComponent = (<T>(props: TableProps<T>) => ReactNode) & {
  Column: typeof Column;
  ColumnGroup: typeof ColumnGroup;
  displayName?: string;
  /** Placeholder in `columns` marking where the expand column goes. */
  EXPAND_COLUMN: TableColumn<any>;
  /** `rowSelection.selections` preset: select every row of every page. */
  SELECTION_ALL: typeof SELECTION_ALL;
  /** Placeholder in `columns` marking where the selection column goes. */
  SELECTION_COLUMN: TableColumn<any>;
  /** Rows rendered by `summary`: `Table.Summary` (`fixed`), `.Row` and `.Cell` (`index`, `colSpan`). */
  Summary: typeof Summary;
  /** `rowSelection.selections` preset: invert the current page. */
  SELECTION_INVERT: typeof SELECTION_INVERT;
  /** `rowSelection.selections` preset: clear the selection. */
  SELECTION_NONE: typeof SELECTION_NONE;
};

const Table = memo(TableInner) as unknown as TableComponent;

Table.displayName = 'Table';
Table.Column = Column;
Table.ColumnGroup = ColumnGroup;
Table.EXPAND_COLUMN = EXPAND_COLUMN as TableColumn<any>;
Table.SELECTION_COLUMN = SELECTION_COLUMN;
Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;
Table.Summary = Summary;

export { TableInner };

export default Table;
