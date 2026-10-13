'use client';

import { cx, useThemeMode } from 'antd-style';
import { CircleHelp, Fullscreen, Minimize, RotateCw, Rows3 } from 'lucide-react';
import {
  type Key,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import Button from '@/base-ui/Button';
import DropdownMenu from '@/base-ui/DropdownMenu';
import Input from '@/base-ui/Input/Input';
import Table from '@/base-ui/Table';
import type {
  SortOrder,
  TableColumn,
  TableFilters,
  TablePaginationConfig,
  TableSorterResult,
} from '@/base-ui/Table/type';
import { useEventCallback } from '@/hooks/useEventCallback';

import ColumnSetting, { type SettingColumn } from './ColumnSetting';
import LightFilter from './LightFilter';
import { CopyableText, renderValue } from './renderValue';
import SearchForm from './SearchForm';
import { PRO_PREFIX_CLS, styles } from './style';
import type {
  ProColumnType,
  ProTableActionType,
  ProTableColumnsStateMap,
  ProTableDensity,
  ProTableFormInstance,
  ProTableLocale,
  ProTablePageInfo,
  ProTableProps,
} from './type';
import { useFetchData } from './useFetchData';
import { getSearchFields, useSearchForm } from './useSearchForm';
import {
  getByPath,
  getProColumnKey,
  isEmptyValue,
  readPersistedState,
  resolveValueEnum,
  resolveValueType,
  valueEnumToList,
  writePersistedState,
} from './utils';

export const DEFAULT_PRO_TABLE_LOCALE: Required<Omit<ProTableLocale, 'alertSelected'>> & {
  alertSelected: (count: number) => ReactNode;
} = {
  alertClear: 'Clear',
  alertSelected: (count) => `${count} selected`,
  collapse: 'Collapse',
  columnSetting: 'Column settings',
  columnSettingReset: 'Reset',
  columnSettingTitle: 'Columns',
  copy: 'Copy',
  density: 'Density',
  densityLarge: 'Large',
  densityMedium: 'Medium',
  densitySmall: 'Compact',
  expand: 'Expand',
  fixedEnd: 'Pin to end',
  fixedEndTitle: 'Pinned to end',
  fixedStart: 'Pin to start',
  fixedStartTitle: 'Pinned to start',
  fullScreen: 'Full screen',
  moveDown: 'Move down',
  moveUp: 'Move up',
  noFixed: 'Unpin',
  reload: 'Reload',
  reset: 'Reset',
  search: 'Search',
  searchPlaceholder: 'Please enter',
  selectPlaceholder: 'Please select',
  unfixedTitle: 'Not pinned',
};

const assignRef = <V,>(ref: Ref<V> | undefined, value: V) => {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else (ref as { current: V }).current = value;
};

const stableKey = (value: unknown) => {
  try {
    return JSON.stringify(value, (_key, item) =>
      item instanceof Date ? item.toISOString() : item,
    );
  } catch {
    return String(Math.random());
  }
};

const isGroup = (column: ProColumnType<any>) => !!column.children?.length;

const ProTable = <
  T extends Record<string, any> = any,
  Params extends Record<string, any> = Record<string, any>,
>(
  props: ProTableProps<T, Params>,
) => {
  const {
    actionRef,
    beforeSearchSubmit,
    cardBordered,
    className,
    columnEmptyText = '-',
    columns: columnsProp = [],
    columnsState,
    dataSource,
    dateFormatter = 'string',
    debounceTime = 10,
    defaultData,
    defaultSize,
    form: formConfig,
    formRef,
    ghost,
    headerTitle,
    loading: loadingProp,
    locale: localeProp,
    manualRequest = false,
    onChange,
    onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    onReset,
    onSizeChange,
    onSubmit,
    options,
    pagination: paginationProp,
    params,
    polling,
    postData,
    request,
    rowSelection,
    search,
    searchFormRender,
    size: sizeProp,
    style,
    tableAlertOptionRender,
    tableAlertRender,
    tableClassName,
    tableExtraRender,
    tableRender,
    tableStyle,
    toolbar,
    toolBarRender,
    tooltip,
    variant,
    ...tableProps
  } = props;

  const { isDarkMode } = useThemeMode();
  const locale = { ...DEFAULT_PRO_TABLE_LOCALE, ...localeProp };
  const rootRef = useRef<HTMLDivElement>(null);
  const actionHolderRef = useRef<ProTableActionType | undefined>(undefined);

  // ============================== Density ==============================
  const [innerSize, setInnerSize] = useState<ProTableDensity>(defaultSize ?? 'medium');
  const size = sizeProp ?? innerSize;
  const setSize = (next: ProTableDensity) => {
    setInnerSize(next);
    onSizeChange?.(next);
  };

  // ============================ Fullscreen =============================
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const toggleFullScreen = useEventCallback(() => {
    const node = rootRef.current;
    if (!node || typeof document === 'undefined') return;
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void node.requestFullscreen?.();
  });

  // =========================== Columns state ===========================
  const persistKey = columnsState?.persistenceKey;
  const persistType = columnsState?.persistenceType;
  const defaultColumnsState = useMemo(() => {
    const map: ProTableColumnsStateMap = {};
    columnsProp.forEach((column, index) => {
      const key = getProColumnKey(column, index);
      if (column.fixed) map[key] = { fixed: column.fixed };
    });
    return { ...map, ...columnsState?.defaultValue };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [innerColumnsState, setInnerColumnsState] = useState<ProTableColumnsStateMap>(
    () => readPersistedState(persistKey, persistType) ?? defaultColumnsState,
  );
  const columnsStateMap = columnsState?.value ?? innerColumnsState;
  const setColumnsStateMap = (next: ProTableColumnsStateMap) => {
    setInnerColumnsState(next);
    writePersistedState(persistKey, persistType, next);
    columnsState?.onChange?.(next);
  };
  const resetColumnsState = () => {
    writePersistedState(persistKey, persistType, undefined);
    setInnerColumnsState(defaultColumnsState);
    columnsState?.onChange?.(defaultColumnsState);
  };

  // ============================ Pagination =============================
  const paginationConfig: TablePaginationConfig | false =
    paginationProp === false ? false : (paginationProp ?? {});
  const [pageInfo, setPageInfoState] = useState<ProTablePageInfo>(() => ({
    current:
      (paginationConfig && (paginationConfig.current ?? paginationConfig.defaultCurrent)) || 1,
    pageSize:
      (paginationConfig && (paginationConfig.pageSize ?? paginationConfig.defaultPageSize)) || 10,
    total: 0,
  }));
  const mergedPageInfo: ProTablePageInfo = {
    ...pageInfo,
    ...(paginationConfig &&
      paginationConfig.current !== undefined && { current: paginationConfig.current }),
    ...(paginationConfig &&
      paginationConfig.pageSize !== undefined && { pageSize: paginationConfig.pageSize }),
  };
  const setPageInfo = useEventCallback((next: Partial<ProTablePageInfo>) =>
    setPageInfoState((prev) => ({ ...prev, ...next })),
  );

  // ========================== Sort / filter ============================
  const [sort, setSort] = useState<Record<string, SortOrder>>({});
  const [filter, setFilter] = useState<Record<string, (string | number | boolean)[] | null>>({});

  // =========================== Search form =============================
  const searchFields = useMemo(() => getSearchFields(columnsProp), [columnsProp]);
  const [formParams, setFormParams] = useState<Record<string, any>>({});
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const formReadyRef = useRef(false);

  const handleSubmit = useEventCallback((formatted: Record<string, any>) => {
    const next = beforeSearchSubmit ? beforeSearchSubmit(formatted) : formatted;
    formReadyRef.current = true;
    setFormParams(next);
    setPageInfo({ current: 1 });
    onSubmit?.(next);
    void fetcher.reload();
  });

  const { form, values } = useSearchForm({
    dateFormatter,
    fields: searchFields,
    initialValues: formConfig?.initialValues,
    onSubmit: handleSubmit,
    onValuesChange: formConfig?.onValuesChange,
  });
  // The first request already carries the initial form values (Pro submits the form on mount).
  const initialFormParams = useMemo(() => form.getFieldsFormatValue(), [form]);
  const effectiveFormParams = formReadyRef.current ? formParams : initialFormParams;

  useImperativeHandle(formRef as Ref<ProTableFormInstance>, () => form, [form]);

  // ============================== Fetching =============================
  const keywordName =
    options && typeof options.search === 'object' ? (options.search.name ?? 'keyword') : 'keyword';
  const getParams = () => ({
    ...effectiveFormParams,
    ...params,
    ...(keyword !== undefined && keyword !== '' && { [keywordName]: keyword }),
  });

  const fetcher = useFetchData<T>({
    debounceTime,
    defaultData,
    depsKey: stableKey([effectiveFormParams, params, keyword, sort, filter]),
    filter,
    getParams,
    manual: manualRequest,
    onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    pageInfo: mergedPageInfo,
    paginated: paginationConfig !== false,
    polling,
    postData,
    request,
    setTotal: (total) => setPageInfo({ total }),
    sort,
  });

  // `params` changes go back to page 1 (Pro).
  const paramsKey = stableKey(params);
  const firstParamsRef = useRef(true);
  useEffect(() => {
    if (firstParamsRef.current) {
      firstParamsRef.current = false;
      return;
    }
    setPageInfo({ current: 1 });
  }, [paramsKey, setPageInfo]);

  const rows: T[] = request ? fetcher.data : (dataSource ?? defaultData ?? []);
  const loading = loadingProp ?? fetcher.loading;

  // ============================= Selection =============================
  const selectionEnabled = !!rowSelection;
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<Key[]>(
    (rowSelection && rowSelection.defaultSelectedRowKeys) || [],
  );
  const selectedRowKeys = (rowSelection && rowSelection.selectedRowKeys) || innerSelectedKeys;
  const selectedRowsCacheRef = useRef(new Map<Key, T>());
  const rowKeyProp = tableProps.rowKey ?? 'key';
  const getRowKey = useCallback(
    (record: T, index?: number): Key =>
      typeof rowKeyProp === 'function'
        ? rowKeyProp(record, index)
        : (record[rowKeyProp as string] as Key),
    [rowKeyProp],
  );
  rows.forEach((record, index) =>
    selectedRowsCacheRef.current.set(getRowKey(record, index), record),
  );
  const selectedRows = selectedRowKeys
    .map((key) => selectedRowsCacheRef.current.get(key))
    .filter((row): row is T => row !== undefined);

  const clearSelected = useEventCallback(() => {
    setInnerSelectedKeys([]);
    if (rowSelection) rowSelection.onChange?.([], [], { type: 'none' });
  });

  // ============================== Actions ==============================
  const reload = useEventCallback(async (resetPageIndex?: boolean) => {
    if (resetPageIndex) setPageInfo({ current: 1 });
    await fetcher.reload();
  });

  const action: ProTableActionType = {
    clearSelected,
    fullScreen: toggleFullScreen,
    getSortFilter: () => ({ filter, sort }),
    nativeElement: rootRef.current,
    pageInfo: mergedPageInfo,
    reload,
    reloadAndRest: async () => {
      clearSelected();
      await reload(true);
    },
    reset: () => {
      form.resetFields();
      const formatted = form.getFieldsFormatValue();
      formReadyRef.current = true;
      setFormParams(beforeSearchSubmit ? beforeSearchSubmit(formatted) : formatted);
      setPageInfo({ current: 1 });
      void fetcher.reload();
    },
    setPageInfo,
  };
  actionHolderRef.current = action;
  useEffect(() => {
    assignRef(actionRef as Ref<ProTableActionType>, actionHolderRef.current as ProTableActionType);
  });

  const handleReset = useEventCallback(() => {
    form.resetFields();
    const formatted = form.getFieldsFormatValue();
    formReadyRef.current = true;
    const next = beforeSearchSubmit ? beforeSearchSubmit(formatted) : formatted;
    setFormParams(next);
    setPageInfo({ current: 1 });
    onReset?.();
    void fetcher.reload();
  });

  // ============================== Columns ==============================
  const settingColumns: SettingColumn[] = [];
  const tableColumns = useMemo(() => {
    const offset = (mergedPageInfo.current - 1) * mergedPageInfo.pageSize;

    const convert = (
      column: ProColumnType<T>,
      index: number,
      top: boolean,
    ): TableColumn<T> | null => {
      const key = getProColumnKey(column, index);
      const state = top ? columnsStateMap[key] : undefined;
      if (column.hideInTable || state?.show === false) return null;

      const {
        children,
        colSize: _colSize,
        copyable,
        disable: _disable,
        fieldProps,
        filters,
        formItemProps: _formItemProps,
        hideInForm: _hideInForm,
        hideInSearch: _hideInSearch,
        hideInSetting: _hideInSetting,
        hideInTable: _hideInTable,
        initialValue: _initialValue,
        onFilter,
        order: _order,
        render,
        renderFormItem: _renderFormItem,
        renderText,
        search: _search,
        sorter,
        title,
        tooltip: columnTooltip,
        valueEnum: _valueEnum,
        valueType: _valueType,
        ...rest
      } = column;

      const titleNode: ReactNode = columnTooltip ? (
        <span className={styles.titleTooltip}>
          {title}
          <ActionIcon icon={CircleHelp} size="small" title={columnTooltip} />
        </span>
      ) : (
        title
      );

      if (children?.length) {
        const childColumns = children
          .map((child, childIndex) => convert(child, childIndex, false))
          .filter((child): child is TableColumn<T> => child !== null);
        return { ...(rest as any), children: childColumns, key, title: titleNode };
      }

      const valueType = resolveValueType(column);
      const staticEnum = typeof column.valueEnum === 'function' ? undefined : column.valueEnum;
      const resolvedFilters =
        filters === true
          ? valueEnumToList(staticEnum).map((item) => ({ text: item.text, value: item.value }))
          : filters || undefined;
      const resolvedOnFilter =
        onFilter === true
          ? (value: unknown, record: T) =>
              String(getByPath(record, column.dataIndex)) === String(value)
          : onFilter || undefined;

      const fixed = state?.fixed ?? rest.fixed;
      const converted: TableColumn<T> = {
        ...(rest as any),
        ...(valueType === 'option' && rest.align === undefined && { align: 'end' }),
        ...((valueType === 'index' || valueType === 'indexBorder') &&
          rest.width === undefined && { width: 56 }),
        filters: resolvedFilters,
        fixed: fixed === 'left' ? 'start' : fixed === 'right' ? 'end' : fixed,
        key,
        onFilter: resolvedOnFilter,
        // A string sorter is the server field name (see `sort` below); the table only needs `true`.
        sorter: typeof sorter === 'string' ? true : sorter,
        title: titleNode,
        render: (value: any, record: T, rowIndex: number) => {
          const current = actionHolderRef.current;
          const text = renderText ? renderText(value, record, rowIndex, current) : value;
          let dom: ReactNode = renderValue(text, {
            emptyText: columnEmptyText === false ? null : columnEmptyText,
            fieldProps,
            rowIndex: offset + rowIndex,
            valueEnum: resolveValueEnum(column, record),
            valueType: resolveValueType(column, record),
          });
          if (copyable && !isEmptyValue(text)) {
            dom = (
              <CopyableText label={locale.copy} text={String(text)}>
                {dom}
              </CopyableText>
            );
          }
          if (!render) return dom;
          const result = render(dom, record, rowIndex, current, column);
          if (valueType === 'option' && Array.isArray(result)) {
            return <div className={styles.optionCell}>{result}</div>;
          }
          return result;
        },
      };
      return converted;
    };

    const indexed = columnsProp.map((column, index) => ({
      column,
      index,
      key: getProColumnKey(column, index),
    }));
    indexed.sort((a, b) => {
      const orderA = columnsStateMap[a.key]?.order ?? a.index;
      const orderB = columnsStateMap[b.key]?.order ?? b.index;
      return orderA - orderB;
    });
    return indexed
      .map(({ column, index }) => convert(column, index, true))
      .filter((column): column is TableColumn<T> => column !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnsProp,
    columnsStateMap,
    columnEmptyText,
    mergedPageInfo.current,
    mergedPageInfo.pageSize,
  ]);

  // Columns listed in the setting panel, in display order.
  [...columnsProp]
    .map((column, index) => ({ column, index, key: getProColumnKey(column, index) }))
    .sort(
      (a, b) =>
        (columnsStateMap[a.key]?.order ?? a.index) - (columnsStateMap[b.key]?.order ?? b.index),
    )
    .forEach(({ column, key }) => {
      if (column.hideInTable || column.hideInSetting) return;
      const disable =
        columnsStateMap[key]?.disable ??
        (typeof column.disable === 'object' ? column.disable.checkbox : column.disable);
      settingColumns.push({ disabled: !!disable, key, title: column.title ?? key });
    });

  // Server-side sort field names: a string `sorter` renames the field.
  const sortFieldOf = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (list: ProColumnType<T>[]) =>
      list.forEach((column, index) => {
        if (isGroup(column)) walk(column.children!);
        const key = getProColumnKey(column, index);
        if (typeof column.sorter === 'string') map.set(key, column.sorter);
        else if (Array.isArray(column.dataIndex)) map.set(key, column.dataIndex.join('.'));
        else if (column.dataIndex !== undefined) map.set(key, String(column.dataIndex));
      });
    walk(columnsProp);
    return map;
  }, [columnsProp]);

  const handleTableChange = useEventCallback(
    (
      pagination: TablePaginationConfig,
      filters: TableFilters,
      sorter: TableSorterResult<T> | TableSorterResult<T>[],
      extra: Parameters<NonNullable<ProTableProps<T>['onChange']>>[3],
    ) => {
      if (extra.action === 'sort') {
        const list = Array.isArray(sorter) ? sorter : [sorter];
        const next: Record<string, SortOrder> = {};
        list.forEach((item) => {
          if (!item.order || item.columnKey === undefined) return;
          const columnKey = String(item.columnKey);
          next[sortFieldOf.get(columnKey) ?? columnKey] = item.order;
        });
        setSort(next);
      }
      if (extra.action === 'filter') {
        const next: Record<string, (string | number | boolean)[] | null> = {};
        Object.entries(filters).forEach(([columnKey, value]) => {
          next[sortFieldOf.get(columnKey) ?? columnKey] = value;
        });
        setFilter(next);
      }
      onChange?.(pagination, filters, sorter, extra);
    },
  );

  // ============================== Toolbar ==============================
  const optionConfig =
    options === false
      ? false
      : { density: true, fullScreen: false, reload: true, setting: true, ...options };
  const reloadOption = optionConfig && optionConfig.reload;
  const fullScreenOption = optionConfig && optionConfig.fullScreen;
  const settingOption = optionConfig && optionConfig.setting;
  const searchOption = optionConfig && optionConfig.search;

  const optionNodes: ReactNode[] = [];
  if (optionConfig) {
    if (reloadOption) {
      optionNodes.push(
        <ActionIcon
          icon={RotateCw}
          key="reload"
          spin={!!loading && !!request}
          title={locale.reload}
          onClick={() => (typeof reloadOption === 'function' ? reloadOption() : void reload())}
        />,
      );
    }
    if (optionConfig.density) {
      const densityItems = (['large', 'medium', 'small'] as ProTableDensity[]).map((item) => ({
        checked: size === item,
        key: item,
        label:
          item === 'large'
            ? locale.densityLarge
            : item === 'medium'
              ? locale.densityMedium
              : locale.densitySmall,
        onCheckedChange: () => setSize(item),
        type: 'checkbox' as const,
      }));
      optionNodes.push(
        <DropdownMenu items={densityItems} key="density" placement="bottomRight">
          <ActionIcon aria-label={locale.density} icon={Rows3} />
        </DropdownMenu>,
      );
    }
    if (fullScreenOption) {
      optionNodes.push(
        <ActionIcon
          icon={fullscreen ? Minimize : Fullscreen}
          key="fullScreen"
          title={locale.fullScreen}
          onClick={() =>
            typeof fullScreenOption === 'function' ? fullScreenOption() : toggleFullScreen()
          }
        />,
      );
    }
    if (settingOption) {
      const settingProps = typeof settingOption === 'object' ? settingOption : {};
      optionNodes.push(
        <ColumnSetting
          checkable={settingProps.checkable}
          columns={settingColumns}
          draggable={settingProps.draggable}
          key="setting"
          locale={locale}
          showListItemOption={settingProps.showListItemOption}
          state={columnsStateMap}
          onChange={setColumnsStateMap}
          onReset={resetColumnsState}
        />,
      );
    }
  }

  const lightMode = search !== false && search?.filterType === 'light';
  const lightFilterDom =
    lightMode && searchFields.length > 0 ? (
      <LightFilter
        fields={searchFields}
        form={form}
        placeholder={{ input: locale.searchPlaceholder, select: locale.selectPlaceholder }}
        values={values}
      />
    ) : null;

  const keywordDom = searchOption ? (
    <Input
      allowClear
      key="keyword"
      style={{ width: 200 }}
      placeholder={
        (typeof searchOption === 'object' && searchOption.placeholder) || locale.searchPlaceholder
      }
      onClear={() => {
        setKeyword(undefined);
        setPageInfo({ current: 1 });
      }}
      onPressEnter={(event) => {
        const value = (event.target as HTMLInputElement).value;
        if (typeof searchOption === 'object' && searchOption.onSearch?.(value) === false) return;
        setKeyword(value);
        setPageInfo({ current: 1 });
      }}
    />
  ) : null;

  const actionNodes =
    toolBarRender === false
      ? []
      : [
          ...(toolbar?.actions ?? []),
          ...(toolBarRender?.(actionHolderRef.current, { selectedRowKeys, selectedRows }) ?? []),
        ];
  const titleNode = headerTitle ?? toolbar?.title;
  const titleTooltip = tooltip ?? toolbar?.tooltip;
  const settingsNodes = toolbar?.settings ?? optionNodes;

  const hasToolbar =
    toolBarRender !== false &&
    (titleNode !== undefined ||
      actionNodes.length > 0 ||
      settingsNodes.length > 0 ||
      !!lightFilterDom ||
      !!keywordDom);

  const toolbarDom = hasToolbar ? (
    <div className={cx(styles.toolbar, `${PRO_PREFIX_CLS}-toolbar`)}>
      {(titleNode !== undefined || toolbar?.subTitle) && (
        <div className={styles.title}>
          {titleNode}
          {titleTooltip && <ActionIcon icon={CircleHelp} size="small" title={titleTooltip} />}
          {toolbar?.subTitle && <span className={styles.titleSub}>{toolbar.subTitle}</span>}
        </div>
      )}
      <div className={styles.toolbarActions}>
        {lightFilterDom}
        {keywordDom}
        {actionNodes}
        {settingsNodes.length > 0 && (actionNodes.length > 0 || lightFilterDom || keywordDom) && (
          <span className={styles.toolbarDivider} />
        )}
        {settingsNodes.length > 0 && <div className={styles.toolbarOptions}>{settingsNodes}</div>}
      </div>
    </div>
  ) : null;

  // =============================== Alert ===============================
  const alwaysShowAlert = rowSelection ? rowSelection.alwaysShowAlert : false;
  const alertProps = { onCleanSelected: clearSelected, selectedRowKeys, selectedRows };
  const alertInfo =
    tableAlertRender === false
      ? false
      : tableAlertRender
        ? tableAlertRender(alertProps)
        : locale.alertSelected(selectedRowKeys.length);
  const alertOption =
    tableAlertOptionRender === false ? null : tableAlertOptionRender ? (
      tableAlertOptionRender(alertProps)
    ) : (
      <Button size="small" type="link" onClick={clearSelected}>
        {locale.alertClear}
      </Button>
    );
  const alertDom =
    selectionEnabled && alertInfo !== false && (selectedRowKeys.length > 0 || alwaysShowAlert) ? (
      <div className={cx(styles.alert, `${PRO_PREFIX_CLS}-alert`)} role="status">
        <div className={styles.alertInfo}>{alertInfo}</div>
        {alertOption && <div className={styles.alertOption}>{alertOption}</div>}
      </div>
    ) : null;

  // =============================== Table ===============================
  const mergedRowSelection = rowSelection
    ? (() => {
        const { alwaysShowAlert: _always, ...restSelection } = rowSelection;
        return {
          ...restSelection,
          onChange: (keys: Key[], selected: T[], info: { type: any }) => {
            setInnerSelectedKeys(keys);
            restSelection.onChange?.(keys, selected, info);
          },
          // Keep keys across pages of a server table (Pro default).
          preserveSelectedRowKeys: restSelection.preserveSelectedRowKeys ?? !!request,
          selectedRowKeys,
        };
      })()
    : undefined;

  const tablePagination: TablePaginationConfig | false =
    paginationConfig === false
      ? false
      : {
          ...paginationConfig,
          current: mergedPageInfo.current,
          onChange: (page, pageSize) => {
            setPageInfo({ current: page, pageSize });
            paginationConfig.onChange?.(page, pageSize);
          },
          pageSize: mergedPageInfo.pageSize,
          ...(request && { total: mergedPageInfo.total }),
        };

  const tableDom = (
    <Table<T>
      {...tableProps}
      className={tableClassName}
      columns={tableColumns}
      dataSource={rows}
      loading={loading}
      pagination={tablePagination}
      rowSelection={mergedRowSelection}
      size={size}
      style={tableStyle}
      variant={variant}
      onChange={handleTableChange}
    />
  );

  const cardBorder = (part: 'search' | 'table') =>
    typeof cardBordered === 'object' ? !!cardBordered[part] : !!cardBordered;
  const cardClass = (part: 'search' | 'table') =>
    cx(
      styles.card,
      isDarkMode && styles.cardDark,
      cardBorder(part) && styles.cardBordered,
      ghost && styles.ghost,
      `${PRO_PREFIX_CLS}-${part}`,
    );

  const tableBody = (
    <>
      {toolbarDom}
      {alertDom}
      {tableDom}
    </>
  );
  const tableCard = (
    <div className={cardClass('table')}>
      {tableRender
        ? tableRender(props, tableBody, { alert: alertDom, table: tableDom, toolbar: toolbarDom })
        : tableBody}
    </div>
  );

  let searchDom: ReactNode = null;
  if (search !== false && !lightMode && searchFields.length > 0) {
    const formDom = (
      <div className={cardClass('search')}>
        <SearchForm
          config={search ?? {}}
          fields={searchFields}
          form={form}
          loading={!!loading && !!request}
          values={values}
          locale={{
            collapse: locale.collapse,
            expand: locale.expand,
            inputPlaceholder: locale.searchPlaceholder,
            reset: locale.reset,
            search: locale.search,
            selectPlaceholder: locale.selectPlaceholder,
          }}
          onReset={handleReset}
        />
      </div>
    );
    searchDom = searchFormRender ? searchFormRender(props, formDom) : formDom;
  }

  return (
    <div
      className={cx(styles.root, PRO_PREFIX_CLS, className)}
      data-fullscreen={fullscreen || undefined}
      ref={rootRef}
      style={style}
    >
      {searchDom}
      {tableExtraRender?.(props, rows)}
      {tableCard}
    </div>
  );
};

ProTable.displayName = 'ProTable';

export default ProTable;
