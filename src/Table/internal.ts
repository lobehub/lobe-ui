import type { Ref } from 'react';

import type { TableStore } from './store/createTableStore';
import type { TableProps } from './type';

export interface TableInternalHandle {
  clearSelection: () => void;
  store: TableStore;
}

export type TableInternalProps<T> = TableProps<T> & {
  internalRef?: Ref<TableInternalHandle>;
};
