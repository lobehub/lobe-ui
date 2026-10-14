import type { ReactNode } from 'react';

import type { TableColumnType } from './type';

export interface TableColumnGroupProps<T> extends Omit<TableColumnType<T>, 'dataIndex'> {
  /** `Table.Column` / `Table.ColumnGroup` elements rendered under this header. */
  children: ReactNode;
}

const ColumnGroup = <T,>(_props: TableColumnGroupProps<T>): ReactNode => null;

export default ColumnGroup;
