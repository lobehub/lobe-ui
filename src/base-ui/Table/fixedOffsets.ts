import type { CSSProperties } from 'react';

import type { TableColumn } from './type';

const widthOf = (column: TableColumn<any>) => (typeof column.width === 'number' ? column.width : 0);

export const getFixedOffsets = (columns: TableColumn<any>[]): (CSSProperties | undefined)[] => {
  const offsets: (CSSProperties | undefined)[] = columns.map(() => undefined);

  let left = 0;
  columns.forEach((column, index) => {
    if (column.fixed !== 'left') return;
    offsets[index] = { left, position: 'sticky' };
    left += widthOf(column);
  });

  let right = 0;
  for (let index = columns.length - 1; index >= 0; index--) {
    const column = columns[index];
    if (column.fixed !== 'right') continue;
    offsets[index] = { position: 'sticky', right };
    right += widthOf(column);
  }

  return offsets;
};
