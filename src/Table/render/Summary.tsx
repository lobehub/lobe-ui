'use client';

import { createContext, type ReactNode, use } from 'react';

import { TableCell, TableSummaryFoot } from '../atoms';
import { getFixedInfo, type StickyOffsets } from '../engine/fixed';
import type { EngineColumn } from '../engine/types';
import type { TableSummaryCellProps, TableSummaryProps, TableSummaryRowProps } from '../type';

interface SummaryContextValue {
  leaves: readonly Pick<EngineColumn, 'fixed'>[];
  offsets: StickyOffsets;
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
  const fixedInfo = summary
    ? getFixedInfo(index, index + colSpan - 1, summary.leaves, summary.offsets)
    : undefined;
  return (
    <TableCell
      align={align}
      className={className}
      colSpan={colSpan}
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

export const SummaryFooter = ({ children }: { children: ReactNode }) => (
  <TableSummaryFoot>{children}</TableSummaryFoot>
);
