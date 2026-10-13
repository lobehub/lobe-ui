'use client';

import clsx from 'clsx';
import { type ComponentType, type ReactNode, type Ref, useEffect, useMemo, useRef } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import Table from '@/Table';
import type { TableInternalHandle, TableInternalProps } from '@/Table/internal';

import { useColumnsState } from './hooks/useColumnsState';
import { useDensity } from './hooks/useDensity';
import { useFullscreen } from './hooks/useFullscreen';
import { usePageInfo } from './hooks/usePageInfo';
import { useProColumns } from './hooks/useProColumns';
import { useProLoading } from './hooks/useProLoading';
import { useProLocale } from './hooks/useProLocale';
import { useProRequest } from './hooks/useProRequest';
import { useRowCache } from './hooks/useRowCache';
import { useTableBindings } from './hooks/useTableBindings';
import { PRO_TABLE_LOCALE_EN_US } from './locale';
import KeywordInput from './parts/KeywordInput';
import LightFilter from './parts/LightFilter';
import SearchSection from './parts/SearchSection';
import TableAlert from './parts/TableAlert';
import Toolbar from './parts/Toolbar';
import ToolbarOptions from './parts/ToolbarOptions';
import { partClass, PRO_PREFIX_CLS, styles } from './style';
import type { ProTableActionType, ProTableProps } from './type';
import { toTableProps } from './utils';

export const DEFAULT_PRO_TABLE_LOCALE = PRO_TABLE_LOCALE_EN_US;

const DEFAULT_OPTIONS = { density: true, fullScreen: false, reload: true, setting: true };

const assignRef = <V,>(ref: Ref<V> | undefined, value: V) => {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else (ref as { current: V }).current = value;
};

const ProTable = <
  T extends Record<string, any> = any,
  Params extends Record<string, any> = Record<string, any>,
>(
  props: ProTableProps<T, Params>,
) => {
  const {
    actionRef,
    cardBordered,
    className,
    columnEmptyText = '-',
    columns: columnsProp,
    columnsState,
    dataSource,
    defaultData,
    defaultSize,
    form: formConfig,
    headerTitle,
    loading: loadingProp,
    locale: localeProp,
    onSizeChange,
    options,
    pagination: paginationProp,
    request,
    rowSelection,
    search,
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
  } = props;
  const tableProps = toTableProps(props);
  const columns = useMemo(() => columnsProp ?? [], [columnsProp]);
  const InternalTable = Table as ComponentType<TableInternalProps<T>>;

  const { locale, tableLocale } = useProLocale(localeProp);

  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<TableInternalHandle>(null);
  const actionHolderRef = useRef<ProTableActionType | undefined>(undefined);
  const [size, setSize] = useDensity(sizeProp, defaultSize, onSizeChange);
  const [fullscreen, toggleFullScreen] = useFullscreen(rootRef);
  const columnsStateApi = useColumnsState(columns, columnsState);
  const { config: paginationConfig, pageInfo, setPageInfo } = usePageInfo(paginationProp);

  const { settingColumns, sortFieldOf, tableColumns } = useProColumns<T>({
    actionRef: actionHolderRef,
    columnEmptyText,
    columns,
    copyLabel: locale.copy,
    current: pageInfo.current,
    pageSize: pageInfo.pageSize,
    state: columnsStateApi.state,
  });

  const requestApi = useProRequest<T>({
    pageInfo,
    paginated: paginationConfig !== false,
    props: props as ProTableProps<T, any>,
    setPageInfo,
    sortFieldOf,
  });
  const { fetcher, form, searchFields } = requestApi;

  const hasRequest = !!request;
  const rows: T[] = request ? fetcher.data : (dataSource ?? defaultData ?? []);
  const { loading, tableLoading } = useProLoading(loadingProp, fetcher.loading, hasRequest);

  const getRow = useRowCache(rows, (tableProps.rowKey ?? 'key') as string);
  const clearSelected = useEventCallback(() => handleRef.current?.clearSelection());

  const action: ProTableActionType = {
    clearSelected,
    fullScreen: toggleFullScreen,
    getSortFilter: requestApi.getSortFilter,
    nativeElement: rootRef.current,
    pageInfo,
    reload: requestApi.reload,
    reloadAndRest: async () => {
      clearSelected();
      await requestApi.reload(true);
    },
    reset: requestApi.reset,
    setPageInfo,
  };
  actionHolderRef.current = action;
  useEffect(() => {
    assignRef(actionRef as Ref<ProTableActionType>, actionHolderRef.current as ProTableActionType);
  });

  const bindings = useTableBindings<T>({
    hasRequest,
    pageInfo,
    paginationConfig,
    rowSelection,
    setPageInfo,
  });

  const optionConfig = options === false ? false : { ...DEFAULT_OPTIONS, ...options };
  const searchOption = optionConfig && optionConfig.search;
  const lightMode = search !== false && search?.filterType === 'light';
  const reloading = !!loading && !!request;

  const keywordDom = searchOption ? (
    <KeywordInput
      config={searchOption}
      placeholder={locale.searchPlaceholder}
      onSearch={requestApi.searchKeyword}
    />
  ) : null;
  const filterDom =
    lightMode && searchFields.length > 0 ? (
      <LightFilter
        fields={searchFields}
        form={form}
        ignoreRules={formConfig?.ignoreRules}
        placeholder={{ input: locale.searchPlaceholder, select: locale.selectPlaceholder }}
      />
    ) : null;
  const settingsDom: ReactNode =
    toolbar?.settings ??
    (optionConfig ? (
      <ToolbarOptions
        columnsState={columnsStateApi.state}
        config={optionConfig}
        fullscreen={fullscreen}
        locale={locale}
        reloading={reloading}
        settingColumns={settingColumns}
        size={size}
        onColumnsStateChange={columnsStateApi.setState}
        onColumnsStateReset={columnsStateApi.resetState}
        onReload={() => void requestApi.reload()}
        onSizeChange={setSize}
        onToggleFullScreen={toggleFullScreen}
      />
    ) : null);

  const title = headerTitle ?? toolbar?.title;
  const hasToolbar =
    toolBarRender !== false &&
    Boolean(
      title !== undefined ||
      toolbar?.actions?.length ||
      toolBarRender ||
      settingsDom ||
      filterDom ||
      keywordDom,
    );
  const toolbarDom = hasToolbar ? (
    <Toolbar<T>
      actionRef={actionHolderRef}
      actions={toolbar?.actions}
      filter={filterDom}
      getRow={getRow}
      handleRef={handleRef}
      keyword={keywordDom}
      settings={settingsDom}
      subTitle={toolbar?.subTitle}
      title={title}
      toolBarRender={toolBarRender || undefined}
      tooltip={tooltip ?? toolbar?.tooltip}
    />
  ) : null;

  const alertDom = rowSelection ? (
    <TableAlert<T>
      alwaysShow={rowSelection.alwaysShowAlert}
      getRow={getRow}
      handleRef={handleRef}
      locale={locale}
      optionRender={tableAlertOptionRender}
      render={tableAlertRender}
      onClear={clearSelected}
    />
  ) : null;

  const tableDom = (
    <InternalTable
      {...tableProps}
      className={tableClassName}
      columns={tableColumns}
      dataSource={rows}
      internalRef={handleRef}
      loading={tableLoading}
      locale={tableLocale}
      pagination={bindings.pagination}
      rowSelection={bindings.rowSelection}
      size={size}
      style={tableStyle}
      variant={variant}
      onChange={requestApi.handleTableChange}
    />
  );

  const tableBody = (
    <>
      {toolbarDom}
      {alertDom}
      {tableDom}
    </>
  );

  const searchDom =
    search !== false && !lightMode && searchFields.length > 0 ? (
      <SearchSection<T>
        fields={searchFields}
        form={form}
        loading={reloading}
        locale={locale}
        props={props}
        onReset={requestApi.handleReset}
      />
    ) : null;

  return (
    <div
      className={clsx(styles.root, PRO_PREFIX_CLS, className)}
      data-fullscreen={fullscreen || undefined}
      ref={rootRef}
      style={style}
    >
      {searchDom}
      {tableExtraRender?.(props, rows)}
      <div className={partClass(cardBordered, 'table')}>
        {tableRender
          ? tableRender(props, tableBody, { alert: alertDom, table: tableDom, toolbar: toolbarDom })
          : tableBody}
      </div>
    </div>
  );
};

ProTable.displayName = 'ProTable';

export default ProTable;
