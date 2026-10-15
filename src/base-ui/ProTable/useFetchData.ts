import { useCallback, useEffect, useRef, useState } from 'react';

import type { SortOrder } from '@/base-ui/Table/type';

import type {
  ProTablePageInfo,
  ProTableRequest,
  ProTableRequestData,
  ProTableRequestFilter,
} from './type';

type Filter = Record<string, (string | number | boolean)[] | null>;

export interface UseFetchDataOptions<T> {
  debounceTime: number;
  defaultData?: T[];
  /** Everything except the page that a fetch depends on, as a stable string. */
  depsKey: string;
  filter: Filter;
  getParams: () => Record<string, any>;
  manual: boolean;
  onDataSourceChange?: (data: T[]) => void;
  onLoad?: (data: T[]) => void;
  onLoadingChange?: (loading: boolean) => void;
  onRequestError?: (error: Error) => void;
  pageInfo: ProTablePageInfo;
  paginated: boolean;
  polling?: number | ((data: T[]) => number);
  postData?: (data: T[]) => T[];
  request?: ProTableRequest<T, any>;
  setTotal: (total: number) => void;
  sort: Record<string, SortOrder>;
}

/** `request` driving: debounced fetch on deps / page change, stale-response guard, polling. */
export const useFetchData = <T>(options: UseFetchDataOptions<T>) => {
  const [data, setData] = useState<T[]>(options.defaultData ?? []);
  const [loading, setLoading] = useState(false);
  const latest = useRef(options);
  latest.current = options;
  const requestId = useRef(0);
  const [enabled, setEnabled] = useState(!options.manual);
  const [token, setToken] = useState(0);
  const pending = useRef<(() => void)[]>([]);

  const updateLoading = (next: boolean) => {
    setLoading(next);
    latest.current.onLoadingChange?.(next);
  };

  const run = useCallback(async () => {
    const opts = latest.current;
    if (!opts.request) return;
    const id = ++requestId.current;
    updateLoading(true);
    try {
      const params: Record<string, any> = { ...opts.getParams() };
      if (opts.paginated) {
        params.current = opts.pageInfo.current;
        params.pageSize = opts.pageInfo.pageSize;
      }
      // A `request` resolving `null` / `undefined` (e.g. an empty API body) is treated as empty data.
      const response: Partial<ProTableRequestData<T>> = (await opts.request(
        params as any,
        opts.sort,
        opts.filter as ProTableRequestFilter,
      )) ?? { data: [] };
      if (id !== requestId.current) return;
      if (response.success === false) {
        // Pro keeps the previous data when the request reports failure.
        return;
      }
      const raw = response.data ?? [];
      const next = opts.postData ? opts.postData(raw) : raw;
      setData(next);
      opts.setTotal(response.total ?? next.length);
      opts.onLoad?.(next);
      opts.onDataSourceChange?.(next);
    } catch (error) {
      if (id !== requestId.current) return;
      if (opts.onRequestError) opts.onRequestError(error as Error);
      else console.error(error);
    } finally {
      if (id === requestId.current) updateLoading(false);
      const resolvers = pending.current;
      pending.current = [];
      resolvers.forEach((resolve) => resolve());
    }
  }, []);

  const { current, pageSize } = options.pageInfo;
  useEffect(() => {
    if (!enabled || !latest.current.request) return;
    const delay = latest.current.debounceTime;
    if (delay <= 0) {
      void run();
      return;
    }
    const timer = setTimeout(() => void run(), delay);
    return () => clearTimeout(timer);
  }, [enabled, token, options.depsKey, current, pageSize, run]);

  // Polling: schedule the next round once the current one is done.
  useEffect(() => {
    const { polling } = latest.current;
    if (!polling || loading || !enabled) return;
    const interval = typeof polling === 'function' ? polling(data) : polling;
    if (!interval) return;
    const timer = setTimeout(() => void run(), Math.max(interval, 2000));
    return () => clearTimeout(timer);
  }, [data, loading, enabled, options.polling, run]);

  /** Force a fetch (also enables a `manualRequest` table); resolves when it settles. */
  const reload = useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (!latest.current.request) {
          resolve();
          return;
        }
        pending.current.push(resolve);
        setEnabled(true);
        setToken((value) => value + 1);
      }),
    [],
  );

  return { data, loading, reload, setData };
};
