import { useCallback, useMemo, useState } from 'react';

import {
  EXPAND_COLUMN_WIDTH,
  SELECTION_COLUMN_WIDTH,
  SELECTION_DROPDOWN_WIDTH,
  VIRTUAL_ROW_HEIGHT,
} from '../constants';
import type { TableExpandableConfig, TableRowSelection, TableSize, TableVariant } from '../type';
import type { NormalizedColumn } from './normalizeColumns';

const parseWidth = (total: number, width: number | string | undefined) => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string' && width.endsWith('%'))
    return (total * Number.parseFloat(width)) / 100;
  return null;
};

const leavesOf = <T>(columns: readonly NormalizedColumn<T>[]): NormalizedColumn<T>[] =>
  columns.flatMap((column) => (column.children?.length ? leavesOf(column.children) : [column]));

export const fillColumnWidths = <T>(
  columns: readonly NormalizedColumn<T>[],
  scrollWidth: number | string | true | undefined,
  clientWidth: number,
): number[] => {
  const leaves = leavesOf(columns);
  const total = typeof scrollWidth === 'number' && scrollWidth > 0 ? scrollWidth : 0;
  if (!total) return leaves.map((leaf) => parseWidth(clientWidth, leaf.width) ?? 0);

  let given = 0;
  let missing = 0;
  leaves.forEach((leaf) => {
    const width = parseWidth(total, leaf.width);
    if (width) given += width;
    else missing += 1;
  });
  const maxFit = Math.max(total, clientWidth);
  let rest = Math.max(maxFit - given, missing);
  let restCount = missing;
  const average = rest / missing;
  let realTotal = 0;
  const widths = leaves.map((leaf) => {
    let width = parseWidth(total, leaf.width);
    if (!width) {
      const floor = Math.floor(average);
      width = restCount === 1 ? rest : floor;
      rest -= floor;
      restCount -= 1;
    }
    realTotal += width;
    return width;
  });
  if (realTotal < maxFit) {
    const scale = maxFit / realTotal;
    let remain = maxFit;
    return widths.map((width, index) => {
      const next = Math.floor(width * scale);
      const value = index === widths.length - 1 ? remain : next;
      remain -= next;
      return value;
    });
  }
  return widths;
};

export const useVirtualLayout = <T>({
  expandable,
  rowSelection,
  variant,
  virtual,
}: {
  expandable?: TableExpandableConfig<T>;
  rowSelection?: TableRowSelection<T>;
  variant: TableVariant;
  virtual?: boolean;
}) => {
  const [componentWidth, setComponentWidth] = useState(0);
  const measureRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element || !virtual || typeof ResizeObserver === 'undefined') return;
      setComponentWidth(element.offsetWidth);
      const observer = new ResizeObserver(() => setComponentWidth(element.offsetWidth));
      observer.observe(element);
      return () => observer.disconnect();
    },
    [virtual],
  );

  const withDropdown = Boolean(rowSelection?.selections) && rowSelection?.type !== 'radio';
  return useMemo(
    () => ({
      componentWidth,
      expandColumnWidth: virtual && expandable ? EXPAND_COLUMN_WIDTH : undefined,
      fillWidths: fillColumnWidths<T>,
      measureRef,
      rowHeight: (size: TableSize) => VIRTUAL_ROW_HEIGHT[size],
      selectionColumnWidth:
        virtual && rowSelection
          ? SELECTION_COLUMN_WIDTH +
            (withDropdown ? SELECTION_DROPDOWN_WIDTH : 0) +
            (variant === 'outlined' ? 16 : 0)
          : undefined,
    }),
    [componentWidth, virtual, expandable, rowSelection, withDropdown, variant, measureRef],
  );
};
