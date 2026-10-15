'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ArrowDownFromLine, ArrowUpDown, ArrowUpToLine } from 'lucide-react';
import type { ReactNode } from 'react';

import ActionIcon from '@/ActionIcon';
import Tooltip from '@/Tooltip';

import { TableHeader, TableHeaderCell, TableRow } from '../atoms';
import type { HeaderCellModel } from '../engine/types';
import { renderColumnTitle } from '../pipeline/columnUtils';
import type { ColumnSource } from '../pipeline/normalizeColumns';
import { getMultiplePriority, getNextSortOrder } from '../pipeline/useSorter';
import { styles } from '../style';
import type {
  SortOrder,
  TableColumn,
  TableColumnType,
  TableHeaderCellAttributes,
  TableLocale,
  TableSorterTooltipProps,
} from '../type';
import { useHeaderView, useTableView } from './context';
import FilterDropdown from './FilterDropdown';
import { SelectionHeaderTitle } from './SelectionCells';

const sx = (...list: (stylex.StyleXStyles | false | null | undefined)[]) =>
  stylex.props(...list).className;

const sortTipOf = (next: SortOrder | undefined, locale: TableLocale) =>
  next === 'descend'
    ? locale.triggerDesc
    : next === 'ascend'
      ? locale.triggerAsc
      : locale.cancelSort;

const ariaSortOf = (order: SortOrder | undefined) =>
  order === 'ascend' ? 'ascending' : order === 'descend' ? 'descending' : 'none';

interface HeaderParts {
  attributes: TableHeaderCellAttributes;
  className?: string;
  content: ReactNode;
}

const useDataHeader = <T,>(source: ColumnSource<T>): HeaderParts => {
  const { prefixCls } = useTableView<T>();
  const header = useHeaderView<T>();
  const column = source.column as TableColumnType<T>;
  const { id } = source;
  const {
    filterDropdown,
    filters,
    onHeaderCell,
    showSorterTooltip,
    sortDirections,
    sortIcon,
    sorter,
  } = column;
  const order = sorter ? header.sortStates.find(({ key }) => key === id)?.sortOrder : undefined;

  const titleNode = renderColumnTitle(column.title, header.titleProps);
  const titleText =
    typeof titleNode === 'string' || typeof titleNode === 'number' ? String(titleNode) : undefined;
  const titleContent = column.ellipsis ? (
    <span className={clsx(sx(styles.columnTitle), `${prefixCls}-column-title`)}>{titleNode}</span>
  ) : (
    titleNode
  );

  const filterNode =
    filters || filterDropdown ? (
      <FilterDropdown<T>
        column={column}
        columnKey={id}
        filterState={header.filterStates.find(({ key }) => key === id)}
        getPopupContainer={header.getPopupContainer}
        label={titleText ?? id}
        locale={header.locale}
        triggerFilter={header.triggerFilter}
      />
    ) : null;
  const hasControls = Boolean(sorter) || Boolean(filterNode);

  let sorterNode: ReactNode = null;
  if (sorter) {
    const nextOrder = getNextSortOrder(sortDirections ?? header.sortDirections, order);
    const showTooltip = showSorterTooltip ?? header.showSorterTooltip;
    const { target, ...tooltipOptions } =
      typeof showTooltip === 'object' ? showTooltip : ({} as TableSorterTooltipProps);
    const tooltipProps = { title: sortTipOf(nextOrder, header.locale), ...tooltipOptions };
    const iconOnlyTooltip = Boolean(showTooltip) && target === 'sorter-icon';
    const onSort = () =>
      header.triggerSort({
        column: column as TableColumn<T>,
        key: id,
        multiplePriority: getMultiplePriority(column as TableColumn<T>),
        sortOrder: nextOrder,
      });
    const sortAction = (
      <ActionIcon
        active={Boolean(order)}
        className={clsx(sx(styles.sortCaret), `${prefixCls}-column-sorter`)}
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
        className={clsx(sx(styles.sortButton), `${prefixCls}-column-sorters`)}
        title={showTooltip ? undefined : header.locale.sortTitle}
      >
        <span className={sx(styles.sortTitle)} onClick={onSort}>
          {titleContent}
        </span>
        {sortAction}
      </span>
    );
    sorterNode =
      showTooltip && !iconOnlyTooltip ? <Tooltip {...tooltipProps}>{group}</Tooltip> : group;
  }

  const cell = onHeaderCell?.(column as TableColumn<T>);
  return {
    attributes: {
      ...(sorter && { 'aria-sort': ariaSortOf(order) }),
      ...(column.ellipsis && hasControls && titleText && { title: titleText }),
      ...cell,
      className: clsx(sorter && `${prefixCls}-column-has-sorters`, cell?.className),
    },
    className: order ? `${prefixCls}-column-sort` : undefined,
    content: hasControls ? (
      <span className={sx(styles.headerInner)}>
        {sorterNode ?? titleContent}
        {filterNode}
      </span>
    ) : (
      titleContent
    ),
  };
};

const DataHeaderContent = <T,>({
  children,
  source,
}: {
  children: (parts: HeaderParts) => ReactNode;
  source: ColumnSource<T>;
}) => <>{children(useDataHeader(source))}</>;

export const HeaderTitle = <T,>({ source }: { source: ColumnSource<T> }) => {
  if (source.kind === 'selection') return <SelectionHeaderTitle />;
  if (source.kind === 'expand' || source.kind === 'placeholder') {
    return <>{(source.column as TableColumnType<T>).title as ReactNode}</>;
  }
  return <DataHeaderContent source={source}>{(parts) => parts.content}</DataHeaderContent>;
};

const HeaderCell = <T,>({
  cell,
  fixEndDelta,
}: {
  cell: HeaderCellModel<ColumnSource<T>>;
  fixEndDelta: number;
}) => {
  const { components, semanticClassNames, semanticStyles } = useTableView<T>();
  const { source } = cell.column;
  const column = source.column as TableColumnType<T>;

  const render = (parts: HeaderParts) => {
    const { className: attrClassName, style: attrStyle, ...attributes } = parts.attributes;
    return (
      <TableHeaderCell
        {...(attributes as object)}
        align={column.align}
        colSpan={cell.colSpan}
        component={components.headerCell}
        ellipsis={column.ellipsis}
        fixStart={cell.fixedInfo.fixStart}
        rowSpan={cell.rowSpan}
        scope={column.title ? (cell.colSpan > 1 ? 'colgroup' : 'col') : undefined}
        shadowEnd={cell.fixedInfo.shadowEnd}
        shadowStart={cell.fixedInfo.shadowStart}
        style={{ ...semanticStyles.header.cell, ...attrStyle }}
        zIndex={cell.fixedInfo.zIndex}
        zIndexReverse={cell.fixedInfo.zIndexReverse}
        className={clsx(
          column.className,
          semanticClassNames.header.cell,
          parts.className,
          attrClassName,
        )}
        fixEnd={
          cell.fixedInfo.fixEnd === undefined ? undefined : cell.fixedInfo.fixEnd + fixEndDelta
        }
      >
        {parts.content}
      </TableHeaderCell>
    );
  };

  if (source.kind === 'data') {
    return <DataHeaderContent source={source}>{render}</DataHeaderContent>;
  }
  return render({
    attributes: { ...column.onHeaderCell?.(column as TableColumn<T>) },
    content: <HeaderTitle source={source} />,
  });
};

export const HeaderRows = <T,>({
  rows,
  scrollbar = 0,
}: {
  rows: readonly HeaderCellModel<ColumnSource<T>>[][];
  scrollbar?: number;
}) => {
  const { components, leafColumns, prefixCls, semanticClassNames, semanticStyles } =
    useTableView<T>();
  const lastFixed = leafColumns.at(-1)?.fixed;
  const { onHeaderRow } = useHeaderView<T>();
  return (
    <TableHeader
      className={semanticClassNames.header.wrapper}
      component={components.headerWrapper}
      style={semanticStyles.header.wrapper}
    >
      {rows.map((cells, rowIndex) => {
        const rowProps = onHeaderRow?.(
          cells.map((cell) => cell.column.source.column as TableColumn<T>),
          rowIndex,
        );
        return (
          <TableRow
            {...rowProps}
            className={clsx(rowProps?.className, semanticClassNames.header.row)}
            component={components.headerRow}
            key={rowIndex}
            style={{ ...rowProps?.style, ...semanticStyles.header.row }}
          >
            {cells.map((cell) => (
              <HeaderCell cell={cell} fixEndDelta={scrollbar} key={cell.key} />
            ))}
            {scrollbar > 0 && rowIndex === 0 && (
              <TableHeaderCell
                className={`${prefixCls}-cell-scrollbar`}
                component={components.headerCell}
                fixEnd={lastFixed === 'end' ? 0 : undefined}
                rowSpan={rows.length}
              />
            )}
          </TableRow>
        );
      })}
    </TableHeader>
  );
};
