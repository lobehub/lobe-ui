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
  useState,
} from 'react';

import Block from '@/Block';
import Empty from '@/Empty';
import tableMessages from '@/i18n/resources/en/table';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
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
import { A2uiHeader, A2uiPager } from './render/A2uiChrome';
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
import { a2uiChrome, styles } from './style';
import type { TableProps, TableRef } from './type';
import { useTableController } from './useTableController';

const EMPTY_ROWS: any[] = [];

/** Every text / number value of a record, nested objects included (the a2ui search box). */
const recordMatches = (value: unknown, query: string, depth = 0): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' || typeof value === 'number')
    return String(value).toLowerCase().includes(query);
  if (depth < 3 && typeof value === 'object' && !isValidElement(value))
    return Object.values(value).some((item) => recordMatches(item, query, depth + 1));
  return false;
};

const TableInner = <T,>(rawProps: TableInternalProps<T>) => {
  const isA2ui = rawProps.variant === 'a2ui';
  const [query, setQuery] = useState('');
  const sourceRows = rawProps.dataSource ?? (EMPTY_ROWS as T[]);
  const search = isA2ui && rawProps.searchable ? query.trim().toLowerCase() : '';
  const props = useMemo<TableInternalProps<T>>(() => {
    if (!isA2ui) return rawProps;
    return {
      ...rawProps,
      dataSource: search
        ? sourceRows.filter((record) => recordMatches(record, search))
        : rawProps.dataSource,
      // The playground's cells never wrap: wide tables scroll inside the card.
      scroll: rawProps.scroll ?? { x: 'max-content' },
    };
  }, [isA2ui, rawProps, search, sourceRows]);
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
    searchable = false,
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
  ) : customEmpty === undefined && isA2ui ? (
    <div {...stylex.props(a2uiChrome.empty)}>{t(search ? 'table.noMatch' : 'table.emptyText')}</div>
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

  const pager = isA2ui
    ? {
        bottom:
          state.config && sourceRows.length > state.page.pageSize ? (
            <A2uiPager
              nextLabel={t('table.nextPage')}
              ofLabel={t('table.of')}
              pageIndex={state.page.pageIndex}
              pageSize={state.page.pageSize}
              prevLabel={t('table.prevPage')}
              total={state.total}
              onChange={(pageIndex) =>
                state.onPaginationChange({ pageIndex, pageSize: state.page.pageSize })
              }
            />
          ) : null,
        top: null,
      }
    : state.config
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

  // The loading mask is a sibling of the table, so it needs the column count here to stack
  // above fixed cells (z-index up to 2 × columns).
  const rootStyle = {
    '--columns-count': leafColumns.length,
    ...semanticStyles.root,
    ...style,
  } as CSSProperties;

  return (
    <TableStoreProvider value={controller.store}>
      <TableViewContext value={viewValue}>
        <SelectionContext value={selectionValue}>
          <HeaderContext value={headerValue}>
            <div
              ref={setRootRef}
              style={rootStyle}
              className={clsx(
                stylex.props(
                  styles.root,
                  isA2ui && [a2uiStyles.base, a2uiStyles.card, a2uiChrome.card],
                ).className,
                `${PREFIX_CLS}-wrapper`,
                isA2ui && `${PREFIX_CLS}-wrapper-a2ui`,
                rootClassName,
                className,
                semanticClassNames.root,
              )}
            >
              {pager.top}
              {isA2ui && (title || searchable) && (
                <A2uiHeader
                  count={sourceRows.length}
                  query={query}
                  rowsLabel={t('table.rows')}
                  searchLabel={t('table.searchRows')}
                  searchable={searchable}
                  title={title?.(rows)}
                  onSearch={(next) => {
                    setQuery(next);
                    state.onPaginationChange({ pageIndex: 0, pageSize: state.page.pageSize });
                  }}
                />
              )}
              <div
                data-table-wrapper=""
                className={
                  stylex.props(
                    styles.spinContainer,
                    isA2ui && (title || searchable) && a2uiChrome.tableRuled,
                  ).className
                }
              >
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
                  title={title && !isA2ui ? title(rows) : undefined}
                  variant={variant}
                  virtual={controller.virtualInput}
                  virtualScrollRef={controller.virtualScrollRef}
                  onColumnResize={controller.onColumnResize}
                  onScroll={onScroll}
                />
                {isLoading && (
                  <div {...stylex.props(styles.loading)} data-table-loading="">
                    <Block
                      align={'center'}
                      data-table-loading-indicator=""
                      gap={8}
                      padding={12}
                      variant={'outlined'}
                    >
                      <Spin {...spinRest} variant={spinVariant} />
                      {tip as ReactNode}
                    </Block>
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
