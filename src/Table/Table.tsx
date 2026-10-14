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
import tableMessages from '@/i18n/resources/en/table';
import { useTranslation } from '@/i18n/useTranslation';
import Spin from '@/Spin';

import Column from './Column';
import ColumnGroup from './ColumnGroup';
import { PREFIX_CLS } from './constants';
import { getStickyOffsets } from './engine/fixed';
import type { TableInternalProps } from './internal';
import { EXPAND_COLUMN } from './pipeline/columnUtils';
import {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './pipeline/selectionUtils';
import { HeaderContext, SelectionContext, TableViewContext } from './render/context';
import FixedFrost from './render/FixedFrost';
import TableLoadingSkeleton from './render/LoadingSkeleton';
import { renderPaginationBars } from './render/PaginationBar';
import { TableSummary } from './render/Summary';
import { resolveSticky, toTableRef } from './render/tableHelpers';
import TableView from './render/TableView';
import { useViewContexts } from './render/useViewContexts';
import { useStableSemantic } from './semantic';
import { TableStoreProvider } from './store/hooks';
import { styles } from './style';
import type { TableProps, TableRef } from './type';
import { useTableController } from './useTableController';

const TableInner = <T,>(props: TableInternalProps<T>) => {
  const {
    className,
    classNames,
    footer,
    internalRef,
    loading = false,
    onScroll,
    pagination,
    ref,
    rootClassName,
    rowHoverable = true,
    rowSelection,
    scroll,
    showHeader = true,
    size = 'middle',
    sticky,
    style,
    styles: customStyles,
    tableLayout,
    title,
    variant = 'borderless',
    virtual,
  } = props;

  const controller = useTableController(props);
  const { model, rows, state } = controller;
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
  useImperativeHandle(
    internalRef,
    () => ({ clearSelection: controller.selection.actions.clear, store: controller.store }),
    [controller.selection.actions.clear, controller.store],
  );

  const { headerValue, selectionValue, viewValue } = useViewContexts<T>({
    controller,
    props,
    semanticClassNames,
    semanticStyles,
  });
  const leafColumns = model.leafColumns;

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
                  virtual={controller.virtualInput}
                  virtualScrollRef={controller.virtualScrollRef}
                  onColumnResize={controller.onColumnResize}
                  onScroll={onScroll}
                />
                {isLoading && (
                  <div {...stylex.props(styles.loading)} data-table-loading="">
                    <Spin {...spinRest} variant={spinVariant} />
                    {tip as ReactNode}
                  </div>
                )}
                <FixedFrost rootRef={rootRef} />
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
