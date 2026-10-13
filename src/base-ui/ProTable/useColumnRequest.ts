import { useEffect, useMemo, useRef, useState } from 'react';

import type { ProColumnType, ProTableRequestOption } from './type';

const stable = (value: unknown) => {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return '';
  }
};

/**
 * Column-level `request` (ProComponents semantics): loads the options of a select-like search
 * field. `request({ keyWords, ...params })` runs on mount, whenever `params` changes and, while
 * remote search is on (`fieldProps.showSearch` with `fieldProps.filterOption === false`), on
 * typing, debounced by `debounceTime` (default 10ms). Stale responses are dropped.
 */
export const useColumnRequest = (column: ProColumnType<any>) => {
  const { debounceTime = 10, params, request } = column;
  const [options, setOptions] = useState<ProTableRequestOption[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [keyWords, setKeyWords] = useState<string | undefined>(undefined);
  const requestRef = useRef(request);
  requestRef.current = request;
  const idRef = useRef(0);
  const paramsKey = useMemo(() => stable(params), [params]);
  const enabled = !!request;

  useEffect(() => {
    if (!enabled) return;
    const id = ++idRef.current;
    const timer = setTimeout(
      () => {
        const run = requestRef.current;
        if (!run) return;
        setLoading(true);
        Promise.resolve(run({ ...params, keyWords }))
          .then((list) => {
            if (id === idRef.current) setOptions(Array.isArray(list) ? list : []);
          })
          .catch(() => {
            if (id === idRef.current) setOptions([]);
          })
          .finally(() => {
            if (id === idRef.current) setLoading(false);
          });
      },
      // The first load is not debounced beyond the configured time; typing reuses it.
      Math.max(0, debounceTime),
    );
    return () => clearTimeout(timer);
    // `params` is tracked through its serialized key.
  }, [enabled, paramsKey, keyWords, debounceTime]);

  const remoteSearch =
    enabled && !!column.fieldProps?.showSearch && column.fieldProps?.filterOption === false;

  return {
    enabled,
    loading,
    onSearch: remoteSearch ? (value: string) => setKeyWords(value || undefined) : undefined,
    options,
  };
};
