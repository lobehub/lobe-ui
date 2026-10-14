'use client';

import { type Key, memo, type ReactNode, useRef } from 'react';

import { getCellValue } from '../pipeline/columnUtils';
import { useRowExpanded } from '../store/hooks';
import type { TableCellAttributes, TableColumnType } from '../type';
import { type BodyCellProps, CellShell, isRenderedCell } from './CellShell';
import { useTableView } from './context';
import { SelectionBodyCell } from './SelectionCells';

const useCellRender = <T,>(
  column: TableColumnType<T>,
  record: T,
  renderIndex: number,
): [ReactNode, TableCellAttributes | undefined] => {
  const cache = useRef<{ output: [ReactNode, TableCellAttributes | undefined]; record: T } | null>(
    null,
  );
  if (
    cache.current &&
    column.shouldCellUpdate &&
    !column.shouldCellUpdate(record, cache.current.record)
  ) {
    return cache.current.output;
  }
  const value = getCellValue(record, column);
  let output: [ReactNode, TableCellAttributes | undefined];
  if (column.render) {
    const rendered = column.render(value, record, renderIndex);
    output = isRenderedCell(rendered)
      ? [rendered.children, rendered.props]
      : [rendered as ReactNode, undefined];
  } else {
    output = [value as ReactNode, undefined];
  }
  cache.current = { output, record };
  return output;
};

const NestIcon = <T,>({
  depth,
  hasChildren,
  record,
  rowKey,
}: {
  depth: number;
  hasChildren: boolean;
  record: T;
  rowKey: Key;
}) => {
  const { expand, prefixCls } = useTableView<T>();
  const expanded = useRowExpanded(rowKey);
  return (
    <>
      <span
        className={`${prefixCls}-row-indent indent-level-${depth}`}
        style={{ paddingLeft: `${expand.indentSize * depth}px` }}
      />
      {expand.expandIcon({
        expandable: hasChildren,
        expanded,
        onExpand: (target) => expand.toggle(target),
        prefixCls,
        record,
      })}
    </>
  );
};

const DataCell = <T,>({
  depth,
  hasChildren,
  index,
  leaf,
  record,
  renderIndex,
  rowKey,
  withNestIcon,
}: BodyCellProps<T>) => {
  const column = leaf.column.source.column as TableColumnType<T>;
  const [childNode, legacyCellProps] = useCellRender(column, record, renderIndex);
  return (
    <CellShell
      index={index}
      leaf={leaf}
      legacyCellProps={legacyCellProps}
      record={record}
      appendNode={
        withNestIcon ? (
          <NestIcon depth={depth} hasChildren={hasChildren} record={record} rowKey={rowKey} />
        ) : undefined
      }
    >
      {childNode}
    </CellShell>
  );
};

const ExpandCell = <T,>({ index, leaf, record, rowKey }: BodyCellProps<T>) => {
  const { expand, prefixCls } = useTableView<T>();
  const expanded = useRowExpanded(rowKey);
  const icon = expand.expandIcon({
    expandable: expand.rowExpandable ? expand.rowExpandable(record) : true,
    expanded,
    onExpand: (target) => expand.toggle(target),
    prefixCls,
    record,
  });
  return (
    <CellShell index={index} leaf={leaf} record={record}>
      {expand.expandRowByClick ? (
        <span onClick={(event) => event.stopPropagation()}>{icon}</span>
      ) : (
        icon
      )}
    </CellShell>
  );
};

const BodyCellInner = <T,>(props: BodyCellProps<T>) => {
  switch (props.leaf.column.source.kind) {
    case 'selection': {
      return <SelectionBodyCell {...props} />;
    }
    case 'expand': {
      return <ExpandCell {...props} />;
    }
    default: {
      return <DataCell {...props} />;
    }
  }
};

export const BodyCell = memo(BodyCellInner) as typeof BodyCellInner;
