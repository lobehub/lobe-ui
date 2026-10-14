'use client';

import { type ReactNode, type Ref, type RefObject, type UIEvent, useLayoutEffect } from 'react';

import type { LeafColumnModel, RowModel, VirtualInput, VirtualScrollConfig } from '../engine/types';
import { useVirtualModel } from '../engine/useTableEngine';
import type { ColumnSource } from '../pipeline/normalizeColumns';
import type { TableColumnType } from '../type';
import { BodyRow } from './Body';
import { useTableView } from './context';

interface VirtualBodyProps<T> {
  emptyNode: ReactNode;
  holderRef: Ref<HTMLDivElement>;
  input: VirtualInput;
  maxHeight?: number | string;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  rows: readonly RowModel<T>[];
  scrollRef: RefObject<((config: VirtualScrollConfig) => void) | undefined>;
  scrollX?: number | string | true;
}

const getRowSpan = <T,>(leaf: LeafColumnModel<ColumnSource<T>>, row: RowModel<T> | undefined) => {
  if (!row) return 1;
  const column = leaf.column.source.column as TableColumnType<T>;
  return column.onCell?.(row.record, row.index)?.rowSpan ?? 1;
};

const collectSpanLines = <T,>(
  leaves: readonly LeafColumnModel<ColumnSource<T>>[],
  rows: readonly RowModel<T>[],
  start: number,
  end: number,
) => {
  const spanning = leaves.filter(
    (leaf) => (leaf.column.source.column as TableColumnType<T>).onCell,
  );
  if (spanning.length === 0 || end < 0) return [];

  let first = start;
  let covered = spanning.filter((leaf) => getRowSpan(leaf, rows[start]) === 0);
  for (let index = start; index >= 0 && covered.length > 0; index -= 1) {
    covered = covered.filter((leaf) => getRowSpan(leaf, rows[index]) === 0);
    first = index;
  }

  const lines: number[] = [];
  for (let index = first; index <= end; index += 1) {
    if (spanning.some((leaf) => getRowSpan(leaf, rows[index]) > 1)) lines.push(index);
  }
  return lines;
};

const VirtualBody = <T,>({
  emptyNode,
  holderRef,
  input,
  maxHeight,
  onScroll,
  rows,
  scrollRef,
  scrollX,
}: VirtualBodyProps<T>) => {
  const virtual = useVirtualModel(input, rows);
  useLayoutEffect(() => {
    scrollRef.current = virtual.scrollTo;
  });
  const { leafColumns, prefixCls, semanticClassNames, semanticStyles } = useTableView<T>();
  const width = scrollX === true ? 'auto' : scrollX;
  const offset = virtual.items[0]?.start ?? 0;
  const spanLines = collectSpanLines(
    leafColumns,
    rows,
    virtual.items[0]?.index ?? 0,
    virtual.items.at(-1)?.index ?? -1,
  );

  return (
    <div
      style={semanticStyles.body.wrapper}
      className={[`${prefixCls}-tbody-virtual`, semanticClassNames.body.wrapper]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={`${prefixCls}-tbody-virtual-holder`}
        ref={holderRef}
        style={{ maxHeight, overflow: 'auto' }}
        onScroll={onScroll}
      >
        <div
          className={`${prefixCls}-tbody-virtual-holder-inner`}
          style={{ height: virtual.totalSize, minWidth: '100%', position: 'relative', width }}
        >
          {rows.length === 0 ? (
            <div className={`${prefixCls}-placeholder`}>{emptyNode}</div>
          ) : (
            // Not a transform: that opens a stacking context and FixedFrost's rail would
            // cover the fixed cells inside it.
            <div style={{ position: 'relative', top: offset }}>
              {virtual.items.map((item) => {
                const row = rows[item.index];
                if (!row) return null;
                return (
                  <div data-index={item.index} key={item.key} ref={virtual.measureElement}>
                    <BodyRow
                      depth={row.depth}
                      hasChildren={row.hasChildren}
                      index={row.index}
                      record={row.record}
                      renderIndex={row.renderIndex}
                      rowKey={row.key}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {spanLines.map((index) => {
            const row = rows[index];
            const top = virtual.getRange(index)?.start ?? 0;
            const getHeight = (rowSpan: number) =>
              (virtual.getRange(Math.min(index + rowSpan - 1, rows.length - 1))?.end ?? top) - top;
            return (
              <BodyRow
                depth={row.depth}
                extra={{ getHeight, top }}
                hasChildren={row.hasChildren}
                index={row.index}
                key={`extra-${row.key}`}
                record={row.record}
                renderIndex={row.renderIndex}
                rowKey={row.key}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualBody;
