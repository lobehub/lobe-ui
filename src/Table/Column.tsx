import type { ReactNode } from 'react';

import type { TableColumnType } from './type';

export type TableColumnProps<T> = TableColumnType<T>;

const Column = <T,>(_props: TableColumnProps<T>): ReactNode => null;

export default Column;
