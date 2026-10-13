import type { ReactNode } from 'react';

import type { TableColumnType } from './type';

export type TableColumnProps<T> = TableColumnType<T>;

/** JSX sugar for one `columns` entry; `Table` reads its props and it renders nothing itself. */
const Column = <T,>(_props: TableColumnProps<T>): ReactNode => null;

export default Column;
