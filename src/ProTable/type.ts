import type { FormInstance, FormValues, UseFormOptions } from '@lobehub/ui/form';
import type { CSSProperties, Key, MutableRefObject, ReactNode, Ref } from 'react';

import type {
  SortOrder,
  TableColumnFilterItem,
  TableColumnType,
  TableLoadingConfig,
  TablePaginationConfig,
  TableProps,
  TableRowSelection,
  TableSize,
  TableVariant,
} from '@/Table/type';

type ValidateOn = UseFormOptions<FormValues>['validateOn'];

/** Built-in value types; they pick both the cell renderer and the search-form control. */
export type ProTableValueType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'digit'
  | 'money'
  | 'percent'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'dateTime'
  | 'dateRange'
  | 'dateTimeRange'
  | 'time'
  | 'progress'
  | 'code'
  | 'index'
  | 'indexBorder'
  | 'option';

/** ProComponents `valueEnum` status names; `status` draws a colored dot before the text. */
export type ProTableStatus = 'Default' | 'Error' | 'Processing' | 'Success' | 'Warning';

export interface ProTableValueEnumItem {
  color?: string;
  disabled?: boolean;
  status?: ProTableStatus;
  text: ReactNode;
}

/** `{ value: text | { text, status, color, disabled } }`, or a `Map` of the same. */
export type ProTableValueEnum =
  | Record<string, ReactNode | ProTableValueEnumItem>
  | Map<string | number | boolean, ReactNode | ProTableValueEnumItem>;

/** `transform(value, name, allValues)` returns the params to merge (e.g. split a range). */
export type ProTableSearchTransform = (
  value: any,
  name: string,
  allValues: Record<string, any>,
) => Record<string, any> | string | undefined;

/** antd-shaped validation rule, mapped onto Form `required` / `validate`. */
export interface ProTableFormRule {
  len?: number;
  max?: number;
  message?: ReactNode;
  min?: number;
  pattern?: RegExp;
  required?: boolean;
  /** Reject (throw) to fail; the error message (or `message`) is shown. */
  validator?: (
    rule: ProTableFormRule,
    value: any,
    values: Record<string, any>,
  ) => Promise<void> | void;
}

/**
 * The search-form handle passed as `formRef`: the Form instance (`getValue`,
 * `getValues`, `setValue`, `setValues`, `reset`, `resetField`, `validate`, `submit`,
 * `setErrors`, `isDirty`, `isTouched`, `subscribe`, `setSchema`) plus antd-shaped aliases.
 */
export interface ProTableFormInstance<
  Values extends Record<string, any> = Record<string, any>,
> extends FormInstance<Values> {
  /** Values converted the way they are sent to `request` (`dateFormatter`, `transform`). */
  getFieldsFormatValue: () => Record<string, any>;
  /** Raw field values (dates stay `Date`). */
  getFieldsValue: () => Values;
  getFieldValue: (name: string) => any;
  /** Back to the initial values (Form `reset()` goes back to the last submitted values). */
  resetFields: () => void;
  setFieldsValue: (values: Partial<Values>) => void;
  setFieldValue: (name: string, value: any) => void;
  /** Validate every registered field; resolves the values or rejects with `{ errors, valid }`. */
  validateFields: () => Promise<Values>;
}

export interface ProTablePageInfo {
  current: number;
  pageSize: number;
  total: number;
}

/** `actionRef.current`: imperative actions of the table. */
export interface ProTableActionType {
  clearSelected: () => void;
  fullScreen: () => void;
  getSortFilter: () => {
    filter: Record<string, (string | number | boolean)[] | null>;
    sort: Record<string, SortOrder>;
  };
  nativeElement: HTMLDivElement | null;
  pageInfo: ProTablePageInfo;
  /** Fetch again; `resetPageIndex` jumps back to page 1 first. */
  reload: (resetPageIndex?: boolean) => Promise<void>;
  /** Clear the selection, go back to page 1 and fetch. */
  reloadAndRest: () => Promise<void>;
  /** Reset the search form to its initial values, go back to page 1 and fetch. */
  reset: () => void;
  setPageInfo: (pageInfo: Partial<ProTablePageInfo>) => void;
}

/** An option returned by a column `request`. */
export interface ProTableRequestOption {
  [key: string]: any;
  disabled?: boolean;
  label: ReactNode;
  value: string | number | boolean;
}

/**
 * Column `request`: loads the options of a select-like search field. Receives the column
 * `params` and, during remote search, the typed `keyWords`.
 */
export type ProColumnRequest = (params: {
  [key: string]: any;
  keyWords?: string;
}) => Promise<ProTableRequestOption[]>;

export interface ProTableSchemaConfig<T> {
  /** Current form handle; lets `renderFormItem` read sibling fields. */
  form: ProTableFormInstance;
  /** `true` in the search form, `false` in the light filter bar. */
  isQuery: boolean;
  onChange: (value: any) => void;
  record?: T;
  value: any;
}

export interface ProColumnType<T = any> extends Omit<
  TableColumnType<T>,
  'filters' | 'onFilter' | 'render' | 'sorter' | 'title'
> {
  children?: ProColumnType<T>[];
  /** Grid cells the field takes in the search form. @default 1 */
  colSize?: number;
  /** Show a copy button after the cell text. */
  copyable?: boolean;
  /** Debounce of the column `request` (on `params` change and remote search) in ms. @default 10 */
  debounceTime?: number;
  /** Column-setting checkbox disabled (the column can't be hidden). */
  disable?: boolean | { checkbox: boolean };
  /** Props of the generated form control (placeholder, options, allowClear, …). */
  fieldProps?: Record<string, any>;
  /** `true` builds header filters from `valueEnum`. */
  filters?: boolean | TableColumnFilterItem[];
  /** Extra props for the field wrapper; `label` overrides the title in the form. */
  formItemProps?: {
    /** Help text under the control. */
    extra?: ReactNode;
    label?: ReactNode;
    required?: boolean;
    /** Validation rules (Form `required` / `validate`); the query is blocked until they pass. */
    rules?: ProTableFormRule[];
    style?: CSSProperties;
  };
  hideInForm?: boolean;
  hideInSearch?: boolean;
  hideInSetting?: boolean;
  hideInTable?: boolean;
  /** Initial value of the search field. */
  initialValue?: any;
  /** `true` filters locally by exact `valueEnum` key match; `false` disables it. */
  onFilter?: boolean | TableColumnType<T>['onFilter'];
  /** Order in the search form (larger first). */
  order?: number;
  /** Extra params of the column `request`; a change (deep compare) re-requests. */
  params?: Record<string, any>;
  /**
   * `render(dom, record, index, action, schema)`; `dom` is the value-type rendering. With
   * `valueType: 'option'` return an array of action nodes.
   */
  render?: (
    dom: ReactNode,
    record: T,
    index: number,
    action: ProTableActionType | undefined,
    schema: ProColumnType<T>,
  ) => ReactNode;
  /** Custom search control: `(schema, config, form) => node`. */
  renderFormItem?: (
    schema: ProColumnType<T>,
    config: ProTableSchemaConfig<T>,
    form: ProTableFormInstance,
  ) => ReactNode;
  /** Transform the raw cell value before the value-type rendering. */
  renderText?: (text: any, record: T, index: number, action: ProTableActionType | undefined) => any;
  /**
   * Load the search field's options asynchronously (select-like field, replaces `valueEnum` /
   * `fieldProps.options` once loaded). With `fieldProps: { showSearch: true, filterOption: false }`
   * typing re-requests with `keyWords`.
   */
  request?: ProColumnRequest;
  /** `false` hides the column in the search form; `{ transform }` reshapes the submitted value. */
  search?: boolean | { transform: ProTableSearchTransform };
  /** `true` sorts on the server (sent to `request` as `sort`); a function sorts locally. */
  sorter?: TableColumnType<T>['sorter'] | string;
  title?: ReactNode;
  /** Info icon next to the header title. */
  tooltip?: ReactNode;
  valueEnum?: ProTableValueEnum | ((record?: T) => ProTableValueEnum);
  valueType?: ProTableValueType | ((record?: T) => ProTableValueType);
}

export type ProColumns<T = any> = ProColumnType<T>;

export interface ProTableColumnsStateItem {
  /** Column-setting checkbox disabled. */
  disable?: boolean;
  fixed?: 'left' | 'right' | 'start' | 'end' | boolean;
  order?: number;
  show?: boolean;
}

export type ProTableColumnsStateMap = Record<string, ProTableColumnsStateItem>;

export interface ProTableColumnsState {
  defaultValue?: ProTableColumnsStateMap;
  onChange?: (map: ProTableColumnsStateMap) => void;
  persistenceKey?: string;
  persistenceType?: 'localStorage' | 'sessionStorage';
  value?: ProTableColumnsStateMap;
}

export interface ProTableRequestData<T> {
  [key: string]: any;
  data: T[] | undefined;
  success?: boolean;
  total?: number;
}

/** `sort` argument of `request`: column key → order (ProComponents shape). */
export type ProTableRequestSort = Record<string, SortOrder>;

/** `filter` argument of `request`: column key → selected filter values (ProComponents shape). */
export type ProTableRequestFilter = Record<string, (string | number)[] | null>;

/** `request(params, sort, filter)`; resolves `{ data, total, success }` (all optional). */
export type ProTableRequest<T, Params = Record<string, any>> = (
  params: Params & { [key: string]: any; current?: number; keyword?: string; pageSize?: number },
  sort: ProTableRequestSort,
  filter: ProTableRequestFilter,
) => Promise<Partial<ProTableRequestData<T>>>;

/**
 * `loading` as an object: Spin options of the table overlay (`tip`, `variant`, …) plus `delay`
 * (ms before the overlay shows). Without `spinning` the overlay follows the `request` state.
 */
export type ProTableLoadingConfig = TableLoadingConfig & { delay?: number };

/** Breakpoints of a responsive `search.span`, measured on the query form width. */
export type ProTableSpanBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** `search.span` per form width: `xs` < 576 ≤ `sm` < 768 ≤ `md` < 992 ≤ `lg` < 1200 ≤ `xl` < 1600 ≤ `xxl`. */
export type ProTableSpanConfig = Partial<Record<ProTableSpanBreakpoint, number>>;

export type ProTableDensity = 'large' | 'middle' | 'small';

export interface ProTableOptionConfig {
  density?: boolean;
  fullScreen?: boolean | (() => void);
  reload?: boolean | (() => void);
  /** Keyword input in the toolbar; its value goes to `request` as `params[name ?? 'keyword']`. */
  search?:
    | boolean
    | {
        name?: string;
        onSearch?: (keyword: string) => boolean | void;
        placeholder?: string;
      };
  setting?:
    | boolean
    | {
        checkable?: boolean;
        /** Up / down buttons in the panel (drag sorting is not implemented). */
        draggable?: boolean;
        showListItemOption?: boolean;
      };
}

export interface ProTableSearchConfig {
  /** Collapsed state (controlled). */
  collapsed?: boolean;
  /** Replace the collapse toggle; `false` hides it. */
  collapseRender?: false | ((collapsed: boolean) => ReactNode);
  /** @default true */
  defaultCollapsed?: boolean;
  /** Fields visible while collapsed. @default one row */
  defaultColsNumber?: number;
  /** `query` is the grid form; `light` is the compact filter bar. @default 'query' */
  filterType?: 'query' | 'light';
  /** Label column width in px; `'auto'` keeps the label width natural. @default 80 */
  labelWidth?: number | 'auto';
  /** Field layout of the query form. @default 'horizontal' */
  layout?: 'horizontal' | 'vertical';
  onCollapse?: (collapsed: boolean) => void;
  /** Replace the action buttons; `false` hides them. */
  optionRender?:
    | false
    | ((
        config: { form: ProTableFormInstance; onReset: () => void; onSubmit: () => void },
        dom: ReactNode[],
      ) => ReactNode[]);
  resetText?: ReactNode;
  searchText?: ReactNode;
  /**
   * Span of each field in a 24-column grid (`8` = 3 per row), or one per form-width breakpoint
   * (`{ xs: 24, md: 12, xl: 8 }`). Responsive to the width by default.
   */
  span?: number | ProTableSpanConfig;
  submitText?: ReactNode;
}

export interface ProTableAlertRenderProps<T> {
  onCleanSelected: () => void;
  selectedRowKeys: Key[];
  selectedRows: T[];
}

export type ProTableAlertRender<T> = false | ((props: ProTableAlertRenderProps<T>) => ReactNode);

export interface ProTableToolbarConfig {
  actions?: ReactNode[];
  /** Replaces the default `options` icons. */
  settings?: ReactNode[];
  subTitle?: ReactNode;
  title?: ReactNode;
  tooltip?: ReactNode;
}

export interface ProTableLocale {
  alertClear?: ReactNode;
  alertSelected?: (count: number) => ReactNode;
  collapse?: ReactNode;
  columnSetting?: string;
  columnSettingReset?: ReactNode;
  columnSettingTitle?: ReactNode;
  copy?: string;
  density?: string;
  densityLarge?: ReactNode;
  densityMedium?: ReactNode;
  densitySmall?: ReactNode;
  expand?: ReactNode;
  fixedEnd?: string;
  fixedEndTitle?: ReactNode;
  fixedStart?: string;
  fixedStartTitle?: ReactNode;
  fullScreen?: string;
  moveDown?: string;
  moveUp?: string;
  noFixed?: string;
  reload?: string;
  reset?: ReactNode;
  search?: ReactNode;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  unfixedTitle?: ReactNode;
}

export interface ProTableProps<T = any, Params = Record<string, any>> extends Omit<
  TableProps<T>,
  | 'columns'
  | 'dataSource'
  | 'pagination'
  | 'rowSelection'
  | 'size'
  | 'title'
  | 'loading'
  | 'locale'
  | 'ref'
> {
  actionRef?: MutableRefObject<ProTableActionType | undefined> | Ref<ProTableActionType>;
  /** Hook to reshape the form values before they become `params`. */
  beforeSearchSubmit?: (params: Record<string, any>) => Record<string, any>;
  /** Frame the query form / table (border, radius, padding); they are flat by default. `{ search, table }` per part. */
  cardBordered?: boolean | { search?: boolean; table?: boolean };
  /** Render cells with empty values as this. @default '-' */
  columnEmptyText?: ReactNode | false;
  columns?: ProColumns<T>[];
  columnsState?: ProTableColumnsState;
  /** Controlled data, used when there is no `request`. */
  dataSource?: T[];
  /** How dates in the search form are sent: `'string'` (`YYYY-MM-DD`), `'number'` (ms), `false` (Date) or a function. @default 'string' */
  dateFormatter?: 'string' | 'number' | false | ((value: Date, valueType: string) => any);
  /** Debounce of `params` driven fetches in ms. @default 10 */
  debounceTime?: number;
  defaultData?: T[];
  /** @default 'middle' */
  defaultSize?: ProTableDensity;
  /** Search form config (ProComponents `form`, Form underneath). */
  form?: {
    /** Skip every column validation rule (`formItemProps.rules` / `required`). */
    ignoreRules?: boolean;
    /** Initial values of the search form. */
    initialValues?: Record<string, any>;
    /** Field layout of the query form; `search.layout` wins. */
    layout?: 'horizontal' | 'vertical';
    onValuesChange?: (changed: any, all: any) => void;
    /** Form `validateOn`. @default 'auto' */
    validateOn?: ValidateOn;
  };
  formRef?: MutableRefObject<ProTableFormInstance | undefined> | Ref<ProTableFormInstance>;
  headerTitle?: ReactNode;
  /** Controlled loading; an object configures the overlay (`delay`, `tip`, …), see `ProTableLoadingConfig`. */
  loading?: boolean | ProTableLoadingConfig;
  /**
   * ProTable texts plus the Table locale. Table's `collapse` / `expand` (row expand
   * labels) are replaced by ProTable's search-form toggle texts, so the keys never conflict.
   * Defaults to the preset of ConfigProvider `locale` (zh* → zh-CN, otherwise en-US).
   */
  locale?: Omit<NonNullable<TableProps<T>['locale']>, keyof ProTableLocale> & ProTableLocale;
  /** Don't fetch on mount; call `actionRef.current.reload()` (or submit the form). */
  manualRequest?: boolean;
  onDataSourceChange?: (dataSource: T[]) => void;
  onLoad?: (dataSource: T[]) => void;
  onLoadingChange?: (loading: boolean) => void;
  onRequestError?: (error: Error) => void;
  onReset?: () => void;
  onSizeChange?: (size: ProTableDensity) => void;
  onSubmit?: (params: Record<string, any>) => void;
  /** Toolbar icons; `false` hides them all. */
  options?: ProTableOptionConfig | false;
  /** `pagination.total` is filled from `request`. */
  pagination?: false | TablePaginationConfig;
  /** Change of reference re-fetches from page 1. */
  params?: Params;
  /** Polling interval in ms (min 2000), or a function of the current data. */
  polling?: number | ((dataSource: T[]) => number);
  /** Post-process the `request` data before it's shown. */
  postData?: (data: T[]) => T[];
  request?: ProTableRequest<T, Params>;
  /** `alwaysShowAlert` keeps the alert bar while nothing is selected. */
  rowSelection?: (TableRowSelection<T> & { alwaysShowAlert?: boolean }) | false;
  /** Query form config; `false` hides it. */
  search?: false | ProTableSearchConfig;
  /** Wrap / replace the search form. */
  searchFormRender?: (props: ProTableProps<T, Params>, defaultDom: ReactNode) => ReactNode;
  /** Controlled density. */
  size?: ProTableDensity;
  tableAlertOptionRender?: ProTableAlertRender<T>;
  tableAlertRender?: ProTableAlertRender<T>;
  tableClassName?: string;
  /** Content between the search form and the table card. */
  tableExtraRender?: (props: ProTableProps<T, Params>, dataSource: T[]) => ReactNode;
  /** Arrange the parts yourself. */
  tableRender?: (
    props: ProTableProps<T, Params>,
    defaultDom: ReactNode,
    domList: { alert: ReactNode; table: ReactNode; toolbar: ReactNode },
  ) => ReactNode;
  tableStyle?: CSSProperties;
  /** Light / header title config (subset of Pro `ListToolBar`). */
  toolbar?: ProTableToolbarConfig;
  /** Buttons on the right of the toolbar; `false` hides the whole toolbar. */
  toolBarRender?:
    | false
    | ((
        action: ProTableActionType | undefined,
        rows: { selectedRowKeys?: Key[]; selectedRows?: T[] },
      ) => ReactNode[]);
  /** Info icon after `headerTitle`. */
  tooltip?: ReactNode;
  /** Table cell style; the card follows it. @default 'borderless' */
  variant?: TableVariant;
}

export type { SortOrder, TableSize };
