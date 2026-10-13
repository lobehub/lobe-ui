'use client';

import type { ReactNode, Ref, UIEvent } from 'react';

import type { RowModel, VirtualModel } from '../engine/types';
import { BodyRow } from './Body';
import { useTableView } from './context';

interface VirtualBodyProps<T> {
  emptyNode: ReactNode;
  holderRef: Ref<HTMLDivElement>;
  maxHeight?: number | string;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  rows: readonly RowModel<T>[];
  scrollX?: number | string | true;
  virtual: VirtualModel;
}

const VirtualBody = <T,>({
  emptyNode,
  holderRef,
  maxHeight,
  onScroll,
  rows,
  scrollX,
  virtual,
}: VirtualBodyProps<T>) => {
  const { prefixCls, semanticClassNames, semanticStyles } = useTableView<T>();
  const width = scrollX === true ? 'auto' : scrollX;
  const offset = virtual.items[0]?.start ?? 0;

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
            <div style={{ transform: `translateY(${offset}px)` }}>
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
        </div>
      </div>
    </div>
  );
};

export default VirtualBody;
