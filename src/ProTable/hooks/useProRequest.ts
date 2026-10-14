import { type Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import type {
  SortOrder,
  TableFilters,
  TablePaginationConfig,
  TableSorterResult,
} from '@/Table/type';

import type { ProTableFormInstance, ProTablePageInfo, ProTableProps } from '../type';
import { useFetchData } from './useFetchData';
import { getSearchFields, useSearchForm } from './useSearchForm';

type Filter = Record<string, (string | number | boolean)[] | null>;

const stableKey = (value: unknown) => {
  try {
    return JSON.stringify(value, (_key, item) =>
      item instanceof Date ? item.toISOString() : item,
    );
  } catch {
    return String(Math.random());
  }
};

interface ProRequestOptions<T> {
  pageInfo: ProTablePageInfo;
  paginated: boolean;
  props: ProTableProps<T, any>;
  setPageInfo: (next: Partial<ProTablePageInfo>) => void;
  sortFieldOf: Map<string, string>;
}

export const useProRequest = <T>({
  pageInfo,
  paginated,
  props,
  setPageInfo,
  sortFieldOf,
}: ProRequestOptions<T>) => {
  const {
    beforeSearchSubmit,
    columns = [],
    dateFormatter = 'string',
    debounceTime = 10,
    defaultData,
    form: formConfig,
    formRef,
    manualRequest = false,
    onChange,
    onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    onReset,
    onSubmit,
    options,
    params,
    polling,
    postData,
    request,
  } = props;

  const [sort, setSort] = useState<Record<string, SortOrder>>({});
  const [filter, setFilter] = useState<Filter>({});
  const searchFields = useMemo(() => getSearchFields(columns), [columns]);
  const [formParams, setFormParams] = useState<Record<string, any>>({});
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const formReadyRef = useRef(false);

  const applyFormValues = (formatted: Record<string, any>) => {
    const next = beforeSearchSubmit ? beforeSearchSubmit(formatted) : formatted;
    formReadyRef.current = true;
    setFormParams(next);
    setPageInfo({ current: 1 });
    return next;
  };

  const handleSubmit = useEventCallback((formatted: Record<string, any>) => {
    const next = applyFormValues(formatted);
    onSubmit?.(next);
    void fetcher.reload();
  });

  const { form } = useSearchForm({
    dateFormatter,
    fields: searchFields,
    initialValues: formConfig?.initialValues,
    onSubmit: handleSubmit,
    onValuesChange: formConfig?.onValuesChange,
    validateOn: formConfig?.validateOn,
  });
  const initialFormParams = useMemo(() => form.getFieldsFormatValue(), [form]);
  const effectiveFormParams = formReadyRef.current ? formParams : initialFormParams;
  useImperativeHandle(formRef as Ref<ProTableFormInstance>, () => form, [form]);

  const keywordName =
    options && typeof options.search === 'object' ? (options.search.name ?? 'keyword') : 'keyword';

  const fetcher = useFetchData<T>({
    debounceTime,
    defaultData,
    depsKey: stableKey([effectiveFormParams, params, keyword, sort, filter]),
    filter,
    getParams: () => ({
      ...effectiveFormParams,
      ...params,
      ...(keyword !== undefined && keyword !== '' && { [keywordName]: keyword }),
    }),
    manual: manualRequest,
    onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    pageInfo,
    paginated,
    polling,
    postData,
    request,
    setTotal: (total) => setPageInfo({ total }),
    sort,
  });

  const paramsKey = stableKey(params);
  const firstParamsRef = useRef(true);
  useEffect(() => {
    if (firstParamsRef.current) {
      firstParamsRef.current = false;
      return;
    }
    setPageInfo({ current: 1 });
  }, [paramsKey, setPageInfo]);

  const reload = useEventCallback(async (resetPageIndex?: boolean) => {
    if (resetPageIndex) setPageInfo({ current: 1 });
    await fetcher.reload();
  });

  const reset = useEventCallback(() => {
    form.resetFields();
    applyFormValues(form.getFieldsFormatValue());
    void fetcher.reload();
  });

  const handleReset = useEventCallback(() => {
    reset();
    onReset?.();
  });

  const searchKeyword = useEventCallback((value: string | undefined) => {
    setKeyword(value);
    setPageInfo({ current: 1 });
  });

  const handleTableChange = useEventCallback(
    (
      pagination: TablePaginationConfig,
      filters: TableFilters,
      sorter: TableSorterResult<T> | TableSorterResult<T>[],
      extra: Parameters<NonNullable<ProTableProps<T>['onChange']>>[3],
    ) => {
      if (extra.action === 'sort') {
        const next: Record<string, SortOrder> = {};
        (Array.isArray(sorter) ? sorter : [sorter]).forEach((item) => {
          if (!item.order || item.columnKey === undefined) return;
          const columnKey = String(item.columnKey);
          next[sortFieldOf.get(columnKey) ?? columnKey] = item.order;
        });
        setSort(next);
      }
      if (extra.action === 'filter') {
        const next: Filter = {};
        Object.entries(filters).forEach(([columnKey, value]) => {
          next[sortFieldOf.get(columnKey) ?? columnKey] = value;
        });
        setFilter(next);
      }
      onChange?.(pagination, filters, sorter, extra);
    },
  );

  const getSortFilter = useEventCallback(() => ({ filter, sort }));

  return {
    fetcher,
    form,
    getSortFilter,
    handleReset,
    handleTableChange,
    reload,
    reset,
    searchFields,
    searchKeyword,
  };
};
