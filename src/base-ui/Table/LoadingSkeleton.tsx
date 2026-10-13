'use client';

import { memo, useMemo } from 'react';

import Skeleton from '@/base-ui/Skeleton';

import { isColumnGroup, isColumnVisibleAt } from './columnUtils';
import { EXPAND_COLUMN_WIDTH, SELECTION_COLUMN_WIDTH, styles } from './style';
import type { TableBreakpoint, TableColumn, TableSize } from './type';

const DEFAULT_ROWS = 5;

/** Varying bar widths so consecutive rows do not look identical. */
const CELL_WIDTHS = [72, 56, 64, 48, 80, 40, 60, 52] as const;

export interface TableLoadingSkeletonProps<T = any> {
  columns: readonly TableColumn<T>[];
  expandColumn?: boolean;
  rows?: number;
  screens: ReadonlySet<TableBreakpoint> | null;
  selectionColumn?: boolean;
  size: TableSize;
}

const resolveTrack = (width: TableColumn<any>['width']) => {
  if (typeof width === 'number') return `${width}px`;
  if (typeof width === 'string' && width) return width;
  return 'minmax(0, 1fr)';
};

const leafColumns = <T,>(
  columns: readonly TableColumn<T>[],
  screens: ReadonlySet<TableBreakpoint> | null,
): TableColumn<T>[] =>
  columns.flatMap((column) => {
    if (!isColumnVisibleAt(column, screens)) return [];
    if (isColumnGroup(column)) return leafColumns(column.children, screens);
    return [column];
  });

/**
 * Body placeholder while `loading` and there are no rows. Uses the real leaf column
 * widths (plus selection / expand tracks when those columns are on) so the skeleton
 * lines up under the live header; row padding follows the table size CSS vars.
 */
function TableLoadingSkeletonInner<T>({
  columns,
  expandColumn = false,
  rows = DEFAULT_ROWS,
  screens,
  selectionColumn = false,
  size,
}: TableLoadingSkeletonProps<T>) {
  const tracks = useMemo(() => {
    const list: string[] = [];
    if (selectionColumn) list.push(`${SELECTION_COLUMN_WIDTH}px`);
    if (expandColumn) list.push(`${EXPAND_COLUMN_WIDTH}px`);
    const leaves = leafColumns(columns, screens);
    if (leaves.length === 0) {
      list.push('minmax(0, 1.4fr)', 'minmax(0, 1fr)', 'minmax(0, 0.8fr)', 'minmax(0, 1fr)');
    } else {
      leaves.forEach((column) => list.push(resolveTrack(column.width)));
    }
    return list;
  }, [columns, expandColumn, screens, selectionColumn]);

  const gridTemplateColumns = tracks.join(' ');
  const rowCount = Math.max(1, rows);

  return (
    <div
      aria-hidden
      className={styles.skeleton}
      data-table-skeleton=""
      data-table-skeleton-size={size === 'middle' ? 'medium' : size}
    >
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <div className={styles.skeletonRow} key={rowIndex} style={{ gridTemplateColumns }}>
          {tracks.map((_, colIndex) => {
            const leadingSelection = selectionColumn && colIndex === 0;
            const leadingExpand = expandColumn && colIndex === (selectionColumn ? 1 : 0);
            const isLeading = leadingSelection || leadingExpand;
            const widthPct = isLeading
              ? 100
              : CELL_WIDTHS[(rowIndex * 3 + colIndex) % CELL_WIDTHS.length];
            return (
              <div className={styles.skeletonCell} key={colIndex}>
                {isLeading ? (
                  <Skeleton height={14} radius={4} width={14} />
                ) : (
                  <Skeleton height={14} radius={4} width={`${widthPct}%`} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const TableLoadingSkeleton = memo(TableLoadingSkeletonInner) as typeof TableLoadingSkeletonInner;

export default TableLoadingSkeleton;
