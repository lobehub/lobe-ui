import type { ReactNode } from 'react';

import type { TableColumnType } from './type';

export interface TableColumnGroupProps<T> extends Omit<TableColumnType<T>, 'dataIndex'> {
  /** `Table.Column` / `Table.ColumnGroup` elements rendered under this header. */
  children: ReactNode;
}

/** JSX sugar for a grouped header; `Table` reads its props and it renders nothing itself. */
const ColumnGroup = <T,>(_props: TableColumnGroupProps<T>): ReactNode => null;

export default ColumnGroup;
