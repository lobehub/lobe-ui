'use client';

import { createContext, type ReactNode, use, useMemo } from 'react';

import { TableCell, TableSummaryFoot } from '../atoms';
import { getFixedInfo, type StickyOffsets } from '../engine/fixed';
import type { EngineColumn } from '../engine/types';
import type { TableSummaryCellProps, TableSummaryProps, TableSummaryRowProps } from '../type';

interface SummaryContextValue {
  leaves: readonly Pick<EngineColumn, 'fixed'>[];
  offsets: StickyOffsets;
  scrollColumnIndex?: number;
}

const SummaryContext = createContext<SummaryContextValue | null>(null);

export const SummaryProvider = SummaryContext.Provider;

const TableSummaryRoot = ({ children }: TableSummaryProps) => <>{children}</>;

const TableSummaryRow = (props: TableSummaryRowProps) => <tr {...props} />;

const TableSummaryCell = ({
  align,
  children,
  className,
  colSpan = 1,
  index,
  rowSpan,
  scope,
  style,
}: TableSummaryCellProps) => {
  const summary = use(SummaryContext);
  const mergedColSpan =
    summary?.scrollColumnIndex !== undefined && index + colSpan === summary.scrollColumnIndex
      ? colSpan + 1
      : colSpan;
  const fixedInfo = summary
    ? getFixedInfo(index, index + mergedColSpan - 1, summary.leaves, summary.offsets)
    : undefined;
  return (
    <TableCell
      align={align}
      className={className}
      colSpan={mergedColSpan}
      fixEnd={fixedInfo?.fixEnd}
      fixStart={fixedInfo?.fixStart}
      rowSpan={rowSpan}
      scope={scope}
      shadowEnd={fixedInfo?.shadowEnd}
      shadowStart={fixedInfo?.shadowStart}
      style={style}
      zIndex={fixedInfo?.zIndex}
      zIndexReverse={fixedInfo?.zIndexReverse}
    >
      {children}
    </TableCell>
  );
};

type TableSummaryComponent = typeof TableSummaryRoot & {
  Cell: typeof TableSummaryCell;
  Row: typeof TableSummaryRow;
};

export const TableSummary = TableSummaryRoot as TableSummaryComponent;
TableSummary.Row = TableSummaryRow;
TableSummary.Cell = TableSummaryCell;

export const SummaryFooter = ({
  children,
  scrollbar = 0,
}: {
  children: ReactNode;
  scrollbar?: number;
}) => {
  const summary = use(SummaryContext);
  const value = useMemo(() => {
    if (!summary || !scrollbar) return summary;
    const leaves = [...summary.leaves, { fixed: summary.leaves.at(-1)?.fixed }];
    return {
      leaves,
      offsets: {
        ...summary.offsets,
        end: [...summary.offsets.end.map((width) => width + scrollbar), 0],
        widths: [...summary.offsets.widths, scrollbar],
      },
      scrollColumnIndex: leaves.length - 1,
    };
  }, [summary, scrollbar]);
  return (
    <SummaryContext value={value}>
      <TableSummaryFoot>{children}</TableSummaryFoot>
    </SummaryContext>
  );
};
