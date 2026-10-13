'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Inbox } from 'lucide-react';
import {
  type CSSProperties,
  isValidElement,
  memo,
  type ReactNode,
  type Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import Empty from '@/Empty';
import { useEventCallback } from '@/hooks/useEventCallback';
import tableMessages from '@/i18n/resources/en/table';
import { useTranslation } from '@/i18n/useTranslation';
import Spin from '@/Spin';

import Column from './Column';
import ColumnGroup from './ColumnGroup';
import { PREFIX_CLS } from './constants';
import { getStickyOffsets } from './engine/fixed';
import { EXPAND_COLUMN } from './pipeline/columnUtils';
import {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './pipeline/selectionUtils';
import { DEFAULT_SORT_DIRECTIONS } from './pipeline/useSorter';
import {
  HeaderContext,
  type HeaderView,
  SelectionContext,
  type SelectionView,
  type TableComponentSet,
  TableViewContext,
  type TableViewValue,
} from './render/context';
import TableLoadingSkeleton from './render/LoadingSkeleton';
import { renderPaginationBars } from './render/PaginationBar';
import { TableSummary } from './render/Summary';
import TableView, { type StickyConfig } from './render/TableView';
import { useStableSemantic } from './semantic';
import { TableStoreProvider } from './store/hooks';
import { styles } from './style';
import type { TableProps, TableRef, TableScrollToConfig, TableSorterTooltipProps } from './type';
import { useTableController } from './useTableController';

const DEFAULT_SORTER_TOOLTIP: TableSorterTooltipProps = { target: 'full-header' };

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

const resolveSticky = (sticky: TableProps<unknown>['sticky']): StickyConfig => {
  const config = typeof sticky === 'object' ? sticky : {};
  const fallback = typeof window === 'undefined' ? (undefined as any) : window;
  return {
    container: config.getContainer?.() || fallback,
    isSticky: Boolean(sticky),
    offsetHeader: config.offsetHeader ?? 0,
    offsetScroll: config.offsetScroll ?? 0,
    offsetSummary: config.offsetSummary ?? 0,
  };
};

const TableInner = <T,>(props: TableProps<T>) => {
  const {
    className,
    classNames,
    components,
    expandable,
    footer,
    getPopupContainer,
    loading = false,
    onHeaderRow,
    onRow,
    onScroll,
    pagination,
    ref,
    rootClassName,
    rowClassName,
    rowHoverable = true,
    rowSelection,
    scroll,
    showHeader = true,
    showSorterTooltip = DEFAULT_SORTER_TOOLTIP,
    size = 'middle',
    sortDirections = DEFAULT_SORT_DIRECTIONS,
    sticky,
    style,
    styles: customStyles,
    tableLayout,
    title,
    variant = 'borderless',
    virtual,
  } = props;

  const controller = useTableController(props);
  const { model, rows, selection, state, tableLocale } = controller;
  const { t } = useTranslation(tableMessages);
  const { classNames: semanticClassNames, styles: semanticStyles } = useStableSemantic(
    classNames,
    customStyles,
    props,
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const { measureRef } = controller;
  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      return measureRef(element);
    },
    [measureRef],
  );
  useImperativeHandle(
    ref as Ref<TableRef>,
    () => toTableRef(rootRef.current!, controller.scrollTo),
    [controller.scrollTo],
  );

  const componentSet = useMemo((): TableComponentSet => {
    const fallback = virtual ? 'div' : undefined;
    return {
      bodyCell: components?.body?.cell ?? fallback,
      bodyRow: components?.body?.row ?? fallback,
      bodyWrapper: components?.body?.wrapper,
      headerCell: components?.header?.cell,
      headerRow: components?.header?.row,
      headerTable: components?.header?.table,
      headerWrapper: components?.header?.wrapper,
      table: components?.table,
    };
  }, [components, virtual]);

  const toggleExpand = useEventCallback((record: T) => controller.toggleExpand(record));
  const leafColumns = model.leafColumns;
  const fixColumn = controller.horizonScroll && leafColumns.some((leaf) => leaf.fixed);

  const viewValue = useMemo(
    (): TableViewValue<T> => ({
      components: componentSet,
      expand: {
        expandedRowClassName: expandable?.expandedRowClassName,
        expandedRowRender: expandable?.expandedRowRender,
        expandIcon: controller.expandIcon,
        expandRowByClick: expandable?.expandRowByClick,
        forceRender: expandable?.forceRender,
        indentSize: controller.indentSize,
        nestIconColumnIndex: controller.nestIconColumnIndex,
        rowExpandable: expandable?.rowExpandable,
        toggle: toggleExpand,
        type: controller.expandType,
      },
      fixColumn,
      getRowKey: controller.getRowKey,
      horizonScroll: controller.horizonScroll,
      leafColumns,
      onRow,
      prefixCls: PREFIX_CLS,
      rowClassName,
      rowHoverable,
      semanticClassNames,
      semanticStyles,
      virtualWidths: controller.virtualWidths,
    }),
    [
      componentSet,
      expandable,
      controller.expandIcon,
      controller.indentSize,
      controller.nestIconColumnIndex,
      toggleExpand,
      controller.expandType,
      fixColumn,
      controller.getRowKey,
      controller.horizonScroll,
      leafColumns,
      onRow,
      rowClassName,
      rowHoverable,
      semanticClassNames,
      semanticStyles,
      controller.virtualWidths,
    ],
  );

  const selectionValue = useMemo(
    (): SelectionView<T> => ({
      actions: selection.actions,
      checkboxPropsMap: selection.checkboxPropsMap,
      expandType: controller.expandType,
      getRowKey: controller.getRowKey,
      getTitleCheckboxProps: rowSelection?.getTitleCheckboxProps,
      hideSelectAll: rowSelection?.hideSelectAll,
      locale: tableLocale,
      renderCell: rowSelection?.renderCell,
      selections: selection.mergedSelections,
      title: rowSelection?.columnTitle,
      type: rowSelection?.type ?? 'checkbox',
    }),
    [selection, controller.expandType, controller.getRowKey, rowSelection, tableLocale],
  );

  const triggerSort = useEventCallback(state.triggerSort);
  const triggerFilter = useEventCallback(state.triggerFilter);
  const headerValue = useMemo(
    (): HeaderView<T> => ({
      filterStates: state.filterStates,
      getPopupContainer,
      locale: tableLocale,
      onHeaderRow,
      showSorterTooltip,
      sortDirections,
      sortStates: state.sortStates,
      titleProps: state.titleProps,
      triggerFilter,
      triggerSort,
    }),
    [
      state.filterStates,
      getPopupContainer,
      tableLocale,
      onHeaderRow,
      showSorterTooltip,
      sortDirections,
      state.sortStates,
      state.titleProps,
      triggerFilter,
      triggerSort,
    ],
  );

  const {
    spinning: isLoading = true,
    tip,
    variant: spinVariant = 'network',
    ...spinRest
  } = typeof loading === 'object' ? loading : { spinning: loading };

  const customEmpty = props.locale?.emptyText;
  const emptyNode = isLoading ? (
    <TableLoadingSkeleton
      columns={controller.columns}
      expandColumn={Boolean(controller.expandType)}
      rows={pagination === false ? 5 : Math.min(5, state.page.pageSize)}
      screens={controller.screens}
      selectionColumn={Boolean(rowSelection)}
      size={size}
    />
  ) : customEmpty === undefined ? (
    <Empty description={t('table.emptyText')} icon={Inbox} imageSize={40} />
  ) : typeof customEmpty === 'function' ? (
    customEmpty()
  ) : (
    customEmpty
  );

  const stickyConfig = resolveSticky(sticky);
  const { summaryNode } = controller;
  const summaryFixed =
    isValidElement<{ fixed?: boolean | 'top' | 'bottom' }>(summaryNode) &&
    summaryNode.type === TableSummary
      ? summaryNode.props.fixed
      : undefined;
  const fixFooter =
    controller.fixHeader || stickyConfig.isSticky || virtual
      ? virtual && summaryNode
        ? (summaryFixed ?? 'bottom')
        : (summaryFixed ?? false)
      : false;

  const hasFixedColumn = leafColumns.some((leaf) => leaf.fixed);
  const mergedTableLayout =
    tableLayout ??
    (hasFixedColumn
      ? scroll?.x === 'max-content'
        ? 'auto'
        : 'fixed'
      : controller.fixHeader ||
          stickyConfig.isSticky ||
          leafColumns.some((leaf) => (leaf.column.source.column as { ellipsis?: unknown }).ellipsis)
        ? 'fixed'
        : 'auto');

  const offsets = useMemo(
    () => getStickyOffsets(controller.columnWidths, leafColumns),
    [controller.columnWidths, leafColumns],
  );

  const pager = state.config
    ? renderPaginationBars({
        classNames: semanticClassNames.pagination,
        config: state.config,
        onChange: state.onPaginationChange,
        page: state.page,
        size: props.size,
        styles: semanticStyles.pagination,
        total: state.total,
      })
    : { bottom: null, top: null };

  const rootStyle: CSSProperties = { ...semanticStyles.root, ...style };

  return (
    <TableStoreProvider value={controller.store}>
      <TableViewContext value={viewValue}>
        <SelectionContext value={selectionValue}>
          <HeaderContext value={headerValue}>
            <div
              ref={setRootRef}
              style={rootStyle}
              className={clsx(
                stylex.props(styles.root).className,
                `${PREFIX_CLS}-wrapper`,
                rootClassName,
                className,
                semanticClassNames.root,
              )}
            >
              {pager.top}
              <div className={stylex.props(styles.spinContainer).className} data-table-wrapper="">
                <TableView<T>
                  bodyRef={controller.bodyRef}
                  colWidths={controller.columnWidths}
                  emptyNode={emptyNode}
                  fixFooter={fixFooter}
                  fixHeader={controller.fixHeader}
                  footer={footer ? footer(rows) : undefined}
                  grouped={controller.grouped}
                  headerRows={model.headerRows}
                  hoverable={rowHoverable}
                  offsets={offsets}
                  rows={model.rows}
                  scrollX={scroll?.x}
                  scrollY={scroll?.y}
                  showHeader={showHeader}
                  size={size}
                  sticky={stickyConfig}
                  summaryNode={summaryNode}
                  tableLayout={mergedTableLayout}
                  title={title ? title(rows) : undefined}
                  variant={variant}
                  virtual={model.virtual}
                  onColumnResize={controller.onColumnResize}
                  onScroll={onScroll}
                />
                {isLoading && (
                  <div {...stylex.props(styles.loading)} data-table-loading="">
                    <Spin {...spinRest} variant={spinVariant} />
                    {tip as ReactNode}
                  </div>
                )}
              </div>
              {pager.bottom}
            </div>
          </HeaderContext>
        </SelectionContext>
      </TableViewContext>
    </TableStoreProvider>
  );
};

type TableComponent = (<T>(props: TableProps<T>) => ReactNode) & {
  Column: typeof Column;
  ColumnGroup: typeof ColumnGroup;
  displayName?: string;
  EXPAND_COLUMN: typeof EXPAND_COLUMN;
  SELECTION_ALL: typeof SELECTION_ALL;
  SELECTION_COLUMN: typeof SELECTION_COLUMN;
  SELECTION_INVERT: typeof SELECTION_INVERT;
  SELECTION_NONE: typeof SELECTION_NONE;
  Summary: typeof TableSummary;
};

const Table = memo(TableInner) as unknown as TableComponent;

Table.displayName = 'Table';
Table.Column = Column;
Table.ColumnGroup = ColumnGroup;
Table.EXPAND_COLUMN = EXPAND_COLUMN;
Table.SELECTION_COLUMN = SELECTION_COLUMN;
Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;
Table.Summary = TableSummary;

export { TableInner };

export default Table;
