import type { EngineColumn, EngineFixed } from '../engine/types';
import type {
  TableBreakpoint,
  TableColumn,
  TableColumnFixed,
  TableExpandableConfig,
  TableRowSelection,
} from '../type';
import {
  EXPAND_COLUMN,
  getColumnId,
  getColumnPos,
  isColumnGroup,
  isColumnVisibleAt,
} from './columnUtils';
import { SELECTION_COLUMN } from './selectionUtils';
import type { ExpandType } from './useExpandable';

export type ColumnKind = 'data' | 'expand' | 'placeholder' | 'selection';

export interface ColumnSource<T> {
  colClassName?: string;
  column: TableColumn<T>;
  id: string;
  kind: ColumnKind;
}

export type NormalizedColumn<T> = EngineColumn<ColumnSource<T>>;

export const toEngineFixed = (
  fixed: TableColumnFixed | null | undefined,
): EngineFixed | undefined => {
  if (fixed === true || fixed === 'left' || fixed === 'start') return 'start';
  if (fixed === 'right' || fixed === 'end') return 'end';
  return undefined;
};

interface PositionedColumn<T> {
  children?: PositionedColumn<T>[];
  column: TableColumn<T>;
  id: string;
}

const positionColumns = <T>(
  columns: readonly TableColumn<T>[],
  screens: ReadonlySet<TableBreakpoint> | null,
  parentPos?: string,
): PositionedColumn<T>[] =>
  columns.flatMap((column, index) => {
    if (!column || typeof column !== 'object') return [];
    if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) return [{ column, id: '' }];
    const pos = getColumnPos(index, parentPos);
    if (column.hidden || !isColumnVisibleAt(column, screens)) return [];
    const item: PositionedColumn<T> = { column, id: getColumnId(column, pos) };
    if (isColumnGroup(column) && column.children.length > 0) {
      item.children = positionColumns(column.children, screens, pos);
    }
    return [item];
  });

export interface NormalizeOptions<T> {
  expandable?: TableExpandableConfig<T>;
  expandColumnWidth?: number | string;
  expandType: ExpandType;
  prefixCls: string;
  rowSelection?: TableRowSelection<T>;
  screens: ReadonlySet<TableBreakpoint> | null;
  selectionColumnWidth?: number | string;
}

const isExpand = <T>(item: PositionedColumn<T>) => item.column === EXPAND_COLUMN;
const isSelection = <T>(item: PositionedColumn<T>) => item.column === SELECTION_COLUMN;

const insertExpandColumn = <T>(
  base: PositionedColumn<T>[],
  { expandable, expandType, prefixCls, rowSelection }: NormalizeOptions<T>,
  width: number | string | undefined,
) => {
  if (expandType !== 'row') return base.filter((item) => !isExpand(item));

  let index = expandable?.expandIconColumnIndex;
  if (expandable?.showExpandColumn === false) index = -1;
  else if ((index ?? 0) > 0 && rowSelection) index = index! - 1;

  let list = [...base];
  if (!list.some(isExpand)) {
    const expandIndex = index || 0;
    const fixed = expandable?.fixed;
    const insertAt =
      expandIndex === 0 && (fixed === 'right' || fixed === 'end') ? base.length : expandIndex;
    if (insertAt >= 0) list.splice(insertAt, 0, { column: EXPAND_COLUMN, id: '' });
  }
  const expandIndex = list.findIndex(isExpand);
  list = list.filter((item, itemIndex) => !isExpand(item) || itemIndex === expandIndex);
  if (expandIndex < 0) return list;

  const fixed = expandable?.fixed ?? base[expandIndex]?.column.fixed;
  list[expandIndex] = {
    column: {
      className: `${prefixCls}-row-expand-icon-cell`,
      fixed: fixed ?? undefined,
      key: '__expand_column',
      title: expandable?.columnTitle,
      width,
    },
    id: '__expand_column',
  };
  return list;
};

const insertSelectionColumn = <T>(
  list: PositionedColumn<T>[],
  { prefixCls, rowSelection }: NormalizeOptions<T>,
  width: number | string | undefined,
) => {
  if (!rowSelection) return list.filter((item) => !isSelection(item));
  let next = [...list];
  if (!next.some(isSelection)) {
    const leadingExpand = next.findIndex((item) => item.id === '__expand_column') === 0;
    next = leadingExpand
      ? [next[0], { column: SELECTION_COLUMN, id: '' }, ...next.slice(1)]
      : [{ column: SELECTION_COLUMN, id: '' }, ...next];
  }
  const selectionIndex = next.findIndex(isSelection);
  next = next.filter((item, index) => !isSelection(item) || index === selectionIndex);

  const prev = next[selectionIndex - 1];
  const after = next[selectionIndex + 1];
  let fixed = rowSelection.fixed;
  if (fixed === undefined) {
    if (after?.column.fixed !== undefined) fixed = after.column.fixed;
    else if (prev?.column.fixed !== undefined) fixed = prev.column.fixed;
  }
  if (fixed && prev?.id === '__expand_column' && prev.column.fixed == null) {
    next[selectionIndex - 1] = { ...prev, column: { ...prev.column, fixed } };
  }
  next[selectionIndex] = {
    column: {
      align: rowSelection.align,
      className: `${prefixCls}-selection-column`,
      fixed,
      key: '__selection_column',
      onCell: rowSelection.onCell,
      width,
    },
    id: '__selection_column',
  };
  return next;
};

const toEngineColumns = <T>(
  list: readonly PositionedColumn<T>[],
  options: NormalizeOptions<T>,
  used: Set<string>,
): NormalizedColumn<T>[] =>
  list.map((item) => {
    const { column } = item;
    let key = item.id;
    while (used.has(key)) key = `${key}_`;
    used.add(key);

    const kind: ColumnKind =
      item.id === '__selection_column'
        ? 'selection'
        : item.id === '__expand_column'
          ? 'expand'
          : 'data';
    const { prefixCls, rowSelection } = options;
    const colClassName =
      kind === 'selection'
        ? [
            `${prefixCls}-selection-col`,
            rowSelection?.selections &&
              rowSelection.type !== 'radio' &&
              `${prefixCls}-selection-col-with-dropdown`,
          ]
            .filter(Boolean)
            .join(' ')
        : kind === 'expand'
          ? `${prefixCls}-expand-icon-col`
          : undefined;

    const engine: NormalizedColumn<T> = {
      fixed: toEngineFixed(column.fixed),
      key,
      source: { colClassName, column, id: item.id, kind },
      width: column.width,
    };
    if ('colSpan' in column && column.colSpan !== undefined) engine.headerColSpan = column.colSpan;
    if (item.children) engine.children = toEngineColumns(item.children, options, used);
    return engine;
  });

const PLACEHOLDER_COLUMN: NormalizedColumn<any> = {
  key: '__placeholder_column',
  source: { column: { render: () => null }, id: '__placeholder_column', kind: 'placeholder' },
};

export const normalizeColumns = <T>(
  columns: readonly TableColumn<T>[],
  options: NormalizeOptions<T>,
): NormalizedColumn<T>[] => {
  const positioned = positionColumns(columns, options.screens);
  const withExpand = insertExpandColumn(positioned, options, options.expandColumnWidth);
  const withSelection = insertSelectionColumn(withExpand, options, options.selectionColumnWidth);
  const result = toEngineColumns(withSelection, options, new Set());
  return result.length ? result : [PLACEHOLDER_COLUMN];
};
