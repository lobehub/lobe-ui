import { TableColGroup, type TableColGroupColumn } from '../atoms';
import type { LeafColumnModel } from '../engine/types';
import type { ColumnSource } from '../pipeline/normalizeColumns';

interface ColGroupsOptions<T> {
  colWidths: readonly number[];
  headerScrollbar: number;
  leafColumns: readonly LeafColumnModel<ColumnSource<T>>[];
  rowCount: number;
  tableLayout: 'auto' | 'fixed';
  virtualWidths?: readonly number[];
}

export const useColGroups = <T,>({
  colWidths,
  headerScrollbar,
  leafColumns,
  rowCount,
  tableLayout,
  virtualWidths,
}: ColGroupsOptions<T>) => {
  const colGroupColumns: TableColGroupColumn[] = leafColumns.map((leaf, index) => ({
    className: leaf.column.source.colClassName,
    minWidth:
      tableLayout === 'auto'
        ? (leaf.column.source.column as { minWidth?: number }).minWidth
        : undefined,
    width: virtualWidths ? virtualWidths[index] : leaf.column.width,
  }));
  const bodyColGroup = <TableColGroup columns={colGroupColumns} />;

  const allMeasured =
    rowCount > 0 &&
    colWidths.length === leafColumns.length &&
    colWidths.every((width) => width !== undefined) &&
    !colWidths.every((width) => !width);
  const holderColGroup =
    allMeasured || headerScrollbar ? (
      <TableColGroup
        columns={[
          ...(allMeasured
            ? colWidths.map((width, index) => ({ ...colGroupColumns[index], width }))
            : colGroupColumns),
          ...(headerScrollbar ? [{ width: headerScrollbar }] : []),
        ]}
      />
    ) : (
      bodyColGroup
    );

  return { bodyColGroup, holderColGroup };
};
