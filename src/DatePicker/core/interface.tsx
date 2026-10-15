import type { GenerateConfig } from './generate';

export type NullableDateType<DateType> = DateType | null | undefined;

export type Locale = {
  locale: string;

  // ======================================================
  // ==                      Format                      ==
  // ======================================================

  // ==================== Input Format ====================
  // Input format
  /** @deprecated Please use `fieldDateFormat` instead */
  dateFormat?: string;
  /** @deprecated Please use `fieldDateTimeFormat` instead */
  dateTimeFormat?: string;
  /** Input field formatter like YYYY-MM-DD HH:mm:ss */
  fieldDateTimeFormat?: string;
  /** Input field formatter like YYYY-MM-DD */
  fieldDateFormat?: string;
  /** Input field formatter like HH:mm:ss */
  fieldTimeFormat?: string;
  /** Input field formatter like YYYY-MM */
  fieldMonthFormat?: string;
  /** Input field formatter like YYYY */
  fieldYearFormat?: string;
  /** Input field formatter like wwww-go */
  fieldWeekFormat?: string;
  /** Input field formatter like YYYY-Q */
  fieldQuarterFormat?: string;

  // ===================== Date Panel =====================
  // Header Format
  /** Display month before year in date panel header */
  monthBeforeYear?: boolean;
  /** year format in header panel */
  yearFormat?: string;
  /** month format in header panel */
  monthFormat?: string;

  // Cell format
  /** year format in body panel */
  cellYearFormat?: string;
  /** quarter format in body panel */
  cellQuarterFormat?: string;
  /** @deprecated Please use `cellDateFormat` instead */
  dayFormat?: string;
  /** day format in body panel */
  cellDateFormat?: string;
  /** meridiem format in body panel */
  cellMeridiemFormat?: string;

  // ======================================================
  // ==                       MISC                       ==
  // ======================================================
  today: string;
  now: string;
  backToToday: string;
  ok: string;
  timeSelect: string;
  hour?: string;
  hours?: string;
  minute?: string;
  minutes?: string;
  seconds?: string;
  nextSecond?: string;
  previousSecond?: string;
  dateSelect: string;
  weekSelect?: string;
  clear: string;
  week: string;
  month: string;
  year: string;
  previousMonth: string;
  nextMonth: string;
  monthSelect: string;
  yearSelect: string;
  decadeSelect: string;

  previousYear: string;
  nextYear: string;
  previousDecade: string;
  nextDecade: string;
  previousCentury: string;
  nextCentury: string;

  shortWeekDays?: string[];
  shortMonths?: string[];
};

export type PanelMode = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade';

export type InternalMode = PanelMode | 'datetime';

export type PickerMode = Exclude<PanelMode, 'datetime' | 'decade'>;

export type DisabledDate<DateType = any> = (
  date: DateType,
  info: {
    type: PanelMode;
    /**
     * Only work in RangePicker.
     * Tell the first date user selected on this range selection.
     * This is not care about what field user click.
     */
    from?: DateType;
  },
) => boolean;

export interface BaseInfo {
  range?: 'start' | 'end';
}

export interface CellRenderInfo<DateType> extends BaseInfo {
  locale?: Locale;
  // The cell wrapper element
  originNode: React.ReactElement;
  prefixCls: string;
  subType?: 'hour' | 'minute' | 'second' | 'millisecond' | 'meridiem';
  today: DateType;
  type: PanelMode;
}

export type CellRender<DateType, CurrentType = DateType | number | string> = (
  current: CurrentType,
  info: CellRenderInfo<DateType>,
) => React.ReactNode;

export interface ValueDate<DateType = any> {
  label: React.ReactNode;
  value: DateType | (() => DateType);
}

// ========================== Time ==========================
export interface DisabledTimes {
  disabledHours?: () => number[];
  disabledMilliseconds?: (hour: number, minute: number, second: number) => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}

export interface SharedTimeProps<DateType extends object = any> {
  /** Only work in picker is `time` */
  changeOnScroll?: boolean;
  /** Set default value template when empty selection */
  defaultOpenValue?: DateType;
  /** @deprecated Use `defaultOpenValue` instead */
  defaultValue?: DateType;
  /** @deprecated Please use `disabledTime` instead. */
  disabledHours?: DisabledTimes['disabledHours'];
  /** @deprecated Please use `disabledTime` instead. */
  disabledMinutes?: DisabledTimes['disabledMinutes'];
  /** @deprecated Please use `disabledTime` instead. */
  disabledSeconds?: DisabledTimes['disabledSeconds'];
  /** Only work in picker is `time` */
  disabledTime?: (date: DateType) => DisabledTimes;
  /** Only work in picker is `time` */
  format?: string;
  /** Only work in picker is `time` */
  hideDisabledOptions?: boolean;
  /** Only work in picker is `time` */
  hourStep?: IntRange<1, 23>;
  /**
   * Only work in picker is `time`.
   * Note that too small step will cause performance issue.
   */
  millisecondStep?: IntRange<1, 999>;
  /** Only work in picker is `time` */
  minuteStep?: IntRange<1, 59>;

  /** Only work in picker is `time` */
  secondStep?: IntRange<1, 59>;

  /** Only work in picker is `time` */
  showHour?: boolean;

  /** Only work in picker is `time` */
  showMillisecond?: boolean;
  /** Only work in picker is `time` */
  showMinute?: boolean;
  /** Only work in picker is `time` */
  showNow?: boolean;

  /** Only work in picker is `time` */
  showSecond?: boolean;

  /**
   * `columns` (default) scrolls hour / minute / second lists; `clock` picks hours and minutes
   * on a dial and steps seconds beside it.
   */
  timePanel?: 'clock' | 'columns';
  /** Only work in picker is `time` */
  use12Hours?: boolean;
}

export type RangeTimeProps<DateType extends object = any> = Omit<
  SharedTimeProps<DateType>,
  'defaultValue' | 'defaultOpenValue' | 'disabledTime'
> & {
  /** @deprecated Use `defaultOpenValue` instead. */
  defaultValue?: DateType[];
  defaultOpenValue?: DateType[];

  disabledTime?: (
    date: DateType,
    range: 'start' | 'end',
    info: { from?: DateType },
  ) => DisabledTimes;
};

// ======================= Components =======================
export type OnPanelChange<DateType> = (value: DateType, mode: PanelMode) => void;

export type LimitDate<DateType extends object = any> =
  | DateType
  | ((info: {
      /**
       * Tell the first date user selected on this range selection.
       * This is not care about what field user click.
       */
      from?: DateType;
    }) => DateType | null | undefined);

export interface SharedPanelProps<DateType extends object = any> {
  // Render
  cellRender?: CellRender<DateType>;

  // Limitation
  disabledDate?: DisabledDate<DateType>;
  generateConfig: GenerateConfig<DateType>;

  // Hover
  /** @private Only used for RangePicker passing. */
  hoverRangeValue: [start: DateType, end: DateType] | null;
  /** @private Only used for SinglePicker passing. */
  hoverValue: DateType[] | null | undefined;
  // Date Library
  locale: Locale;
  maxDate?: DateType;

  minDate?: DateType;

  nextIcon?: React.ReactNode;

  onHover?: (value: DateType | null) => void;
  // Mode
  onModeChange: (mode: PanelMode, date?: DateType) => void;
  onPickerValueChange: (date: DateType) => void;

  /**
   * Should trigger when user select the cell.
   * PickerPanel will mark as `value` in single mode,
   * Or toggle `values` in multiple mode.
   */
  onSelect: (date: DateType) => void;

  // Value
  pickerValue: DateType;
  // Style
  prefixCls: string;
  // Icons
  prevIcon?: React.ReactNode;

  // Time
  /**
   * Only used for `date` mode.
   */
  showTime?: SharedTimeProps<DateType> | null;

  // Week
  /**
   * Only used for `date` mode.
   */
  showWeek?: boolean;

  superNextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  value?: DateType;
  /**
   * Used for `multiple` mode.
   * When not `multiple`, it will be `[value]`.
   */
  values?: DateType[];
}

export type Components<DateType extends object = any> = Partial<
  Record<InternalMode, React.ComponentType<SharedPanelProps<DateType>>> & {
    button?: React.ComponentType<any> | string;
    input?: React.ComponentType<any> | string;
  }
>;

// ========================= Picker =========================
export type CustomFormat<DateType> = (value: DateType) => string;

export type FormatType<DateType = any> = string | CustomFormat<DateType>;

export type SharedHTMLAttrs = Omit<
  React.InputHTMLAttributes<HTMLDivElement>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'placeholder'
  | 'id'
  | 'onInvalid'
  | 'disabled'
  | 'onFocus'
  | 'onBlur'
  | 'onSelect'
  | 'min'
  | 'max'
  | 'onKeyDown'
  | 'size'
  | 'prefix'
>;

export type PickerFocusEventHandler = (e: React.FocusEvent<HTMLElement>, info: BaseInfo) => void;

export type LegacyOnKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  preventDefault: VoidFunction,
) => void;

export type SemanticName = 'root' | 'prefix' | 'input' | 'suffix';

export type PreviewValueType = 'hover';

export type PanelSemanticName =
  'root' | 'header' | 'body' | 'content' | 'item' | 'footer' | 'container';

export interface SharedPickerProps<DateType extends object = any>
  extends
    SharedHTMLAttrs,
    Pick<
      SharedPanelProps<DateType>,
      // Icon
      'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'
    > {
  allowClear?:
    | boolean
    | {
        clearIcon?: React.ReactNode;
      };

  cellRender?: CellRender<DateType>;
  /**
   * @deprecated. This is removed and not work anymore.
   * Value will always be update if user type correct date type.
   * You can use `needConfirm` for confirm requirement.
   */
  changeOnBlur?: boolean;
  className?: string;

  classNames?: Partial<Record<SemanticName, string>> & {
    popup?: Partial<Record<PanelSemanticName, string>>;
  };
  /** @deprecated Please use `allowClear.clearIcon` instead */
  clearIcon?: React.ReactNode;

  // Render
  components?: Components<DateType>;
  /** @deprecated use cellRender instead of dateRender */
  dateRender?: (currentDate: DateType, today: DateType) => React.ReactNode;

  defaultOpen?: boolean;
  // Open
  defaultOpenValue?: DateType;
  // MISC
  direction?: 'ltr' | 'rtl';
  // Disabled
  disabledDate?: DisabledDate<DateType>;

  /**
   * Config the input field parse and format.
   * When set `format.type`, it will force user input type with your input,
   * it's only support basic format mask: YYYY, MM, DD, HH, mm, ss, SSS.
   * Once use config mode, it must be fill with format your config.
   */
  format?:
    | FormatType<DateType>
    | FormatType<DateType>[]
    | {
        format: string;
        type?: 'mask';
      };
  generateConfig: GenerateConfig<DateType>;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  inlinePopup?: boolean;
  inputReadOnly?: boolean;

  /** @deprecated Please use `components.input` instead. */
  inputRender?: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactNode;

  // Config
  locale: Locale;
  /** Limit the selectable range. This will limit picker navigation also */
  maxDate?: DateType;
  /** Limit the selectable range. This will limit picker navigation also */
  minDate?: DateType;

  /** @deprecated use cellRender instead of monthCellRender */
  monthCellRender?: (currentDate: DateType, locale: Locale) => React.ReactNode;

  /**
   * By default. Only `time` or `datetime` show the confirm button in panel.
   * `true` to make every picker need confirm.
   * `false` to trigger change on every time panel closed by the mode = picker.
   */
  needConfirm?: boolean;

  onBlur?: PickerFocusEventHandler;
  onClear?: VoidFunction;
  // Active
  onFocus?: PickerFocusEventHandler;

  /** `preventDefault` is deprecated which will remove from future version. */
  onKeyDown?: LegacyOnKeyDown;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  // range
  /** Default will always order of selection after submit */
  order?: boolean;
  panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
  // Picker
  picker?: PickerMode;

  // Popup
  placement?: string;

  // Icons
  prefix?: React.ReactNode;

  // Styles
  prefixCls?: string;

  /**
   * When user input invalidate date, keep it in the input field.
   * This is only used for strong a11y requirement which do not want modify after blur.
   */
  preserveInvalidOnBlur?: boolean;

  /**
   * When the user selects the date hover option, the value of the input field undergoes a temporary change.
   * `false` will not preview value.
   * `hover` will preview value when hover.
   */
  previewValue?: false | PreviewValueType;

  renderExtraFooter?: (mode: PanelMode) => React.ReactNode;

  rootClassName?: string;
  /**
   * When use `date` picker,
   * Show the button to set current datetime.
   */
  showNow?: boolean;
  /** Only work when picker is `date` or `time` */
  showTime?: boolean | SharedTimeProps<DateType>;
  /** @deprecated Please use `showNow` instead */
  showToday?: boolean;
  /** Only work when picker is `date` */
  showWeek?: boolean;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    popup?: Partial<Record<PanelSemanticName, React.CSSProperties>>;
  };
  suffixIcon?: React.ReactNode;
}

// picker
export interface PickerRef {
  blur: VoidFunction;
  focus: (options?: FocusOptions) => void;
  nativeElement: HTMLDivElement;
}

// rangePicker
export interface RangePickerRef extends Omit<PickerRef, 'focus'> {
  focus: (index?: number | (FocusOptions & { index?: number })) => void;
}

// ======================== Selector ========================
export interface OpenConfig {
  /**
   * By default. Close popup will delay for one frame. `force` will trigger immediately.
   */
  force?: boolean;
  index?: number;
  /**
   * Keep open if prev state is open but set close within the same frame.
   * This is used for RangePicker input switch to another one.
   */
  inherit?: boolean;
}

export type OnOpenChange = (open: boolean, config?: OpenConfig) => void;
export interface SelectorProps<DateType = any> extends SharedHTMLAttrs {
  /** Add `-placeholder` className as a help info */
  activeHelp?: boolean;

  className?: string;
  clearIcon?: React.ReactNode;
  // Direction
  direction?: 'ltr' | 'rtl';
  focused: boolean;
  // Change
  format: FormatType<DateType>[];
  generateConfig: GenerateConfig<DateType>;
  // Invalidate
  inputReadOnly?: boolean;
  locale: Locale;
  /**
   * Convert with user typing for the format template.
   * This will force align the input with template mask.
   */
  maskFormat?: string | null;
  onBlur: (event: React.FocusEvent<HTMLInputElement>, index?: number) => void;
  // Clear
  onClear: VoidFunction;
  // Click
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onFocus: (event: React.FocusEvent<HTMLInputElement>, index?: number) => void;

  onInputChange: VoidFunction;

  onInvalid: (valid: boolean, index?: number) => void;

  /** `preventDefault` is deprecated which will remove from future version. */
  onKeyDown?: LegacyOnKeyDown;

  /** Trigger when need open by selector */
  onOpenChange: OnOpenChange;
  /** Trigger by `enter` key */
  onSubmit: VoidFunction;
  // Open
  open: boolean;
  picker: PickerMode;
  prefix?: React.ReactNode;

  /** When user input invalidate date, keep it in the input field */
  /**
   * By default value in input field will be reset with previous valid value when blur.
   * Set to `false` will keep invalid text in input field when blur.
   */
  preserveInvalidOnBlur?: boolean;
  style?: React.CSSProperties;

  suffixIcon?: React.ReactNode;
}

// ========================== MISC ==========================
// https://stackoverflow.com/a/39495173; need TypeScript >= 4.5
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type ReplaceListType<List, Type> = {
  [P in keyof List]: Type;
};
