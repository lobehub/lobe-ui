import { useMemo, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import type { TablePaginationConfig } from '@/Table/type';

import type { ProTablePageInfo } from '../type';

export const usePageInfo = (pagination: false | TablePaginationConfig | undefined) => {
  const config = useMemo(
    (): TablePaginationConfig | false => (pagination === false ? false : (pagination ?? {})),
    [pagination],
  );
  const [pageInfo, setPageInfoState] = useState<ProTablePageInfo>(() => ({
    current: (config && (config.current ?? config.defaultCurrent)) || 1,
    pageSize: (config && (config.pageSize ?? config.defaultPageSize)) || 10,
    total: 0,
  }));
  const controlledCurrent = config ? config.current : undefined;
  const controlledPageSize = config ? config.pageSize : undefined;
  const merged = useMemo(
    (): ProTablePageInfo => ({
      ...pageInfo,
      ...(controlledCurrent !== undefined && { current: controlledCurrent }),
      ...(controlledPageSize !== undefined && { pageSize: controlledPageSize }),
    }),
    [pageInfo, controlledCurrent, controlledPageSize],
  );
  const setPageInfo = useEventCallback((next: Partial<ProTablePageInfo>) =>
    setPageInfoState((prev) => {
      const changed = Object.entries(next).some(
        ([key, value]) => prev[key as keyof ProTablePageInfo] !== value,
      );
      return changed ? { ...prev, ...next } : prev;
    }),
  );
  return { config, pageInfo: merged, setPageInfo };
};
