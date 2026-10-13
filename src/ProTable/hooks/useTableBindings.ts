import { useMemo } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import type { TablePaginationConfig } from '@/Table/type';

import type { ProTablePageInfo, ProTableProps } from '../type';

interface TableBindingsOptions<T> {
  hasRequest: boolean;
  pageInfo: ProTablePageInfo;
  paginationConfig: TablePaginationConfig | false;
  rowSelection: ProTableProps<T>['rowSelection'];
  setPageInfo: (next: Partial<ProTablePageInfo>) => void;
}

export const useTableBindings = <T>({
  hasRequest,
  pageInfo,
  paginationConfig,
  rowSelection,
  setPageInfo,
}: TableBindingsOptions<T>) => {
  const rowSelectionProp = useMemo(() => {
    if (!rowSelection) return undefined;
    const { alwaysShowAlert: _always, ...rest } = rowSelection;
    return { ...rest, preserveSelectedRowKeys: rest.preserveSelectedRowKeys ?? hasRequest };
  }, [rowSelection, hasRequest]);

  const onPageChange = useEventCallback((page: number, pageSize: number) => {
    setPageInfo({ current: page, pageSize });
    if (paginationConfig) paginationConfig.onChange?.(page, pageSize);
  });
  const pagination = useMemo(
    (): TablePaginationConfig | false =>
      paginationConfig === false
        ? false
        : {
            ...paginationConfig,
            current: pageInfo.current,
            onChange: onPageChange,
            pageSize: pageInfo.pageSize,
            ...(hasRequest && { total: pageInfo.total }),
          },
    [paginationConfig, pageInfo, onPageChange, hasRequest],
  );

  return { pagination, rowSelection: rowSelectionProp };
};
