import type {
  PickerProps as RcPickerProps,
  PickerRef,
  RangePickerProps as RcRangePickerProps,
} from '@rc-component/picker';
import type { GenerateConfig } from '@rc-component/picker/generate';
import type {
  BaseInfo,
  CellRender,
  CellRenderInfo,
  Components,
  Locale,
  PanelMode,
  PickerMode,
  RangePickerRef,
  SharedPanelProps,
  ValueDate,
} from '@rc-component/picker/interface';
import type { Dayjs } from 'dayjs';
import type { ComponentType, CSSProperties, FocusEvent, MouseEvent, ReactNode, Ref } from 'react';

export type { CellRender, CellRenderInfo, PanelMode, PickerMode, PickerRef, RangePickerRef };

/** rc-picker's locale (texts and formats) plus antd's per-`picker` placeholders. */
export interface PickerLocaleLang extends Locale {
  monthPlaceholder?: string;
  placeholder?: string;
  quarterPlaceholder?: string;
  rangeMonthPlaceholder?: [string, string];
  rangePlaceholder?: [string, string];
  rangeQuarterPlaceholder?: [string, string];
  rangeWeekPlaceholder?: [string, string];
  rangeYearPlaceholder?: [string, string];
  weekPlaceholder?: string;
  yearPlaceholder?: string;
}

/** Placeholders of `picker="time"`. */
export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

/** antd's `PickerLocale`, the shape of the `locale` prop. */
export interface PickerLocale {
  /** @deprecated Kept for antd parity; use `lang.fieldDateFormat`. */
  dateFormat?: string;
  /** @deprecated Kept for antd parity; use `lang.fieldDateTimeFormat`. */
  dateTimeFormat?: string;
  lang: PickerLocaleLang;
  /** @deprecated Kept for antd parity; use `lang.fieldMonthFormat`. */
  monthFormat?: string;
  timePickerLocale: TimePickerLocale;
  /** @deprecated Kept for antd parity; use `lang.fieldWeekFormat`. */
  weekFormat?: string;
}

/**
 * The `locale` prop: a full `PickerLocale` (e.g. a spread of an exported default locale) or
 * only the fields to change — `lang` and `timePickerLocale` are merged field by field over the
 * default locale generated from `@lobehub/ui/i18n`.
 */
export type PickerLocaleInput = Omit<Partial<PickerLocale>, 'lang' | 'timePickerLocale'> & {
  lang?: Partial<PickerLocaleLang>;
  timePickerLocale?: TimePickerLocale;
};

/** A `presets` entry: `value` may be a function, evaluated when the preset is hovered or picked. */
export type PresetDate<T = Dayjs> = ValueDate<T>;
/** `components`: replace a panel (`date` / `week` / … / `time`), the `input` or the OK `button`. */
export type PickerComponents = Components<Dayjs>;
/** Props a custom panel in `components` receives (`value`, `onSelect`, `onHover`, …). */
export type PickerPanelProps = SharedPanelProps<Dayjs>;

/** `middle` is kept as an alias of `medium`. */
export type PickerSize = 'large' | 'medium' | 'small' | 'middle';
export type PickerVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type PickerStatus = 'error' | 'warning';
export type PickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

/** @deprecated Use `PickerMode` (the `picker` prop) instead. */
export type CalendarMode = 'date' | 'month' | 'year';

/** Semantic parts of the input box (Semantic DOM). */
export type PickerSemanticName = 'root' | 'prefix' | 'input' | 'suffix';
/** Semantic parts of the popup (Semantic DOM, `classNames.popup` / `styles.popup`). */
export type PickerPopupSemanticName =
  'root' | 'container' | 'header' | 'body' | 'content' | 'item' | 'footer';

export interface PickerSemanticClassNames extends Partial<Record<PickerSemanticName, string>> {
  /** A string is the popup `root` class. */
  popup?: string | Partial<Record<PickerPopupSemanticName, string>>;
}

export interface PickerSemanticStyles extends Partial<Record<PickerSemanticName, CSSProperties>> {
  popup?: Partial<Record<PickerPopupSemanticName, CSSProperties>>;
}

/** `classNames`: an object, or a function of `{ props }` returning one. */
export type PickerClassNames<P = any> =
  PickerSemanticClassNames | ((info: { props: P }) => PickerSemanticClassNames);
/** `styles`: an object, or a function of `{ props }` returning one. */
export type PickerStyles<P = any> =
  PickerSemanticStyles | ((info: { props: P }) => PickerSemanticStyles);

/** Props rc-picker owns internally or that lobe wires up itself. */
type InternalRcProps = 'classNames' | 'generateConfig' | 'locale' | 'prefixCls' | 'styles';

type MultipleRcProps = 'maxTagCount' | 'multiple' | 'removeIcon' | 'tagRender';

type ValueRcProps =
  | 'changeOnBlur'
  | 'defaultValue'
  | 'onCalendarChange'
  | 'onChange'
  | 'onOk'
  | 'placeholder'
  | 'placement'
  | 'size'
  | 'value';

interface LobePickerProps {
  /** @deprecated Use `variant` instead; `bordered={false}` maps to `variant="borderless"`. */
  bordered?: boolean;
  /**
   * @deprecated Use `needConfirm={false}` instead: the value is committed when the popup
   * closes, without the OK button. Ignored when `needConfirm` is set.
   */
  changeOnBlur?: boolean;
  /** @deprecated Use `classNames.popup.root` instead. */
  dropdownClassName?: string;
  /**
   * Popup position relative to the input.
   * @default 'bottomLeft' ('bottomRight' when `direction="rtl"`)
   */
  placement?: PickerPlacement;
  /** @deprecated Use `classNames.popup.root` instead. */
  popupClassName?: string;
  /** @deprecated Use `styles.popup.root` instead. */
  popupStyle?: CSSProperties;
  /** Lobe look: drop shadow under the input box. */
  shadow?: boolean;
  /** @default 'medium' */
  size?: PickerSize;
  status?: PickerStatus;
  /** @default 'outlined' (light) / 'filled' (dark) */
  variant?: PickerVariant;
}

/** Props `tagRender` receives for each picked date in `multiple` mode. */
export interface PickerTagProps<DateType extends object = Dayjs> {
  closable: boolean;
  disabled: boolean;
  /** The date formatted with `format`. */
  label: ReactNode;
  /** Removes the date from the value. */
  onClose: (event?: MouseEvent<HTMLElement>) => void;
  value: DateType;
}

/** `dateString` of a value: a string per date in `multiple` mode. */
export type PickerDateStrings<ValueType> = ValueType extends readonly unknown[]
  ? string[]
  : string | null;

/**
 * antd's `PickerPropsWithMultiple`: `InnerPickerProps` with the value props typed by
 * `ValueType` — `DateType` for one date, `DateType[]` with `multiple`.
 */
export type PickerPropsWithMultiple<DateType, InnerPickerProps, ValueType = DateType> = Omit<
  InnerPickerProps,
  'defaultValue' | 'onCalendarChange' | 'onChange' | 'onOk' | 'value'
> & {
  defaultValue?: ValueType | null;
  onCalendarChange?: (
    date: ValueType | null,
    dateString: PickerDateStrings<ValueType>,
    info: BaseInfo,
  ) => void;
  /** Cleared: `null` for one date, `[]` with `multiple`. */
  onChange?: (date: ValueType | null, dateString: PickerDateStrings<ValueType>) => void;
  onOk?: (date?: ValueType | null) => void;
  value?: ValueType | null;
};

/**
 * DatePicker props other than the value ones, which `PickerPropsWithMultiple` adds.
 * `DateType` is the date library's type (`Dayjs`, or another one with `generatePicker`).
 */
export interface DatePickerBaseProps<DateType extends object = Dayjs>
  extends
    Omit<RcPickerProps<DateType>, InternalRcProps | MultipleRcProps | ValueRcProps>,
    LobePickerProps {
  /** Semantic DOM class names: `root` / `prefix` / `input` / `suffix` and `popup.*`. */
  classNames?: PickerClassNames<DatePickerProps<any>>;
  /** @deprecated Use `renderExtraFooter` instead. */
  footer?: ReactNode;
  /**
   * antd `PickerLocale`: `lang` texts and formats (`fieldDateFormat`, `yearFormat`,
   * `shortWeekDays`, …) and `timePickerLocale`. Defaults to the locale generated from the
   * `@lobehub/ui/i18n` resources in context.
   */
  locale?: PickerLocaleInput;
  /** @deprecated Use `maxDate` instead. */
  max?: DateType;
  /**
   * `multiple`: at most this many tags; `'responsive'` fits as many as the width allows.
   * The rest collapse into a `+ N ...` tag.
   */
  maxTagCount?: number | 'responsive';
  /** @deprecated Use `minDate` instead. */
  min?: DateType;
  /**
   * Pick several dates, shown as tags; clicking a picked cell again removes it. Works on
   * every `picker` except with `showTime`. Values are `Dayjs[]`, sorted unless
   * `order={false}`. No OK button (`needConfirm` defaults to `false`): `onCalendarChange`
   * fires on each click and `onChange` once the popup closes.
   */
  multiple?: boolean;
  /** @deprecated Use `onCalendarChange` instead. Not called with `multiple`. */
  onSelect?: (date: DateType) => void;
  /**
   * `multiple`: sort the picked dates; `false` keeps them in picking order.
   * @default true
   */
  order?: boolean;
  placeholder?: string;
  ref?: Ref<PickerRef>;
  /** `multiple`: the remove icon of each tag. */
  removeIcon?: ReactNode;
  /** Semantic DOM styles: `root` / `prefix` / `input` / `suffix` and `popup.*`. */
  styles?: PickerStyles<DatePickerProps<any>>;
  /** `multiple`: render each picked date's tag, e.g. with base-ui `Tag`. */
  tagRender?: (props: PickerTagProps<DateType>) => ReactNode;
}

/**
 * `ValueType` is `Dayjs` (default) or `Dayjs[]` with `multiple`; `<DatePicker multiple>`
 * infers `Dayjs[]` by itself.
 */
export type DatePickerProps<ValueType = Dayjs> = PickerPropsWithMultiple<
  Dayjs,
  DatePickerBaseProps,
  ValueType
>;

export type DateRangeValue<DateType extends object = Dayjs> = [DateType | null, DateType | null];

/** Which end of a range an event belongs to. */
export interface RangeInfo {
  range: 'start' | 'end';
}

/** `info.from` is the end picked first in the current range selection. */
export type RangeDisabledDate<DateType extends object = Dayjs> = (
  current: DateType,
  info: { from?: DateType; type: PanelMode },
) => boolean;

type RangeRcProps =
  'allowEmpty' | 'disabled' | 'disabledDate' | 'id' | 'onBlur' | 'onFocus' | 'order';

export interface DateRangePickerProps<DateType extends object = Dayjs>
  extends
    Omit<RcRangePickerProps<DateType>, InternalRcProps | RangeRcProps | ValueRcProps>,
    LobePickerProps {
  /**
   * Allow leaving the start / end empty; `true` applies to both ends.
   * @default [false, false]
   */
  allowEmpty?: boolean | [boolean, boolean];
  /** Semantic DOM class names, see `DatePickerProps['classNames']`. */
  classNames?: PickerClassNames<DateRangePickerProps<DateType>>;
  defaultValue?: [DateType | null | undefined, DateType | null | undefined];
  /** Disable the whole picker, or each end separately with `[start, end]`. */
  disabled?: boolean | [boolean, boolean];
  /** Receives `info.from` once one end is picked, e.g. to limit the range length. */
  disabledDate?: RangeDisabledDate<DateType>;
  /** @deprecated Use `renderExtraFooter` instead. */
  footer?: ReactNode;
  /** Ids of the start and end inputs. */
  id?: { end?: string; start?: string };
  /** antd `PickerLocale`, see `DatePickerProps['locale']`. */
  locale?: PickerLocaleInput;
  /** @deprecated Use `maxDate` instead. */
  max?: DateType;
  /** @deprecated Use `minDate` instead. */
  min?: DateType;
  onBlur?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  onCalendarChange?: (
    dates: DateRangeValue<DateType>,
    dateStrings: [string, string],
    info: RangeInfo,
  ) => void;
  onChange?: (dates: DateRangeValue<DateType> | null, dateStrings: [string, string] | null) => void;
  onFocus?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  onOk?: (dates: DateRangeValue<DateType>) => void;
  /**
   * Swap the ends when the end is earlier than the start; `false` keeps them as entered.
   * @default true
   */
  order?: boolean;
  placeholder?: [string, string];
  /** `focus(index)` / `focus({ index })` focuses the start (`0`) or end (`1`) input. */
  ref?: Ref<RangePickerRef>;
  /** Semantic DOM styles, see `DatePickerProps['styles']`. */
  styles?: PickerStyles<DateRangePickerProps<DateType>>;
  value?: [DateType | null | undefined, DateType | null | undefined] | null;
}

/* ------------------------- Static members and generatePicker ------------------------- */

/** antd `PickerProps<DateType>`: DatePicker props over any date library's type. */
export type PickerProps<
  DateType extends object = Dayjs,
  ValueType = DateType,
> = PickerPropsWithMultiple<DateType, DatePickerBaseProps<DateType>, ValueType>;

/** Props of `DatePicker.WeekPicker` / `MonthPicker` / … : `picker` is fixed. */
export type PresetPickerProps<DateType extends object = Dayjs, ValueType = DateType> = Omit<
  PickerProps<DateType, ValueType>,
  'picker'
>;

export type WeekPickerProps<ValueType = Dayjs> = PresetPickerProps<Dayjs, ValueType>;
export type MonthPickerProps<ValueType = Dayjs> = PresetPickerProps<Dayjs, ValueType>;
export type YearPickerProps<ValueType = Dayjs> = PresetPickerProps<Dayjs, ValueType>;
export type QuarterPickerProps<ValueType = Dayjs> = PresetPickerProps<Dayjs, ValueType>;

/** antd `GenericTimePickerProps`: `DatePicker.TimePicker` has no `picker` / `showTime`. */
export type GenericTimePickerProps<DateType extends object = Dayjs, ValueType = DateType> = Omit<
  PickerProps<DateType, ValueType>,
  'picker' | 'showTime'
>;
export type TimePickerProps<ValueType = Dayjs> = GenericTimePickerProps<Dayjs, ValueType>;

/** antd-style alias of `DateRangePickerProps`. */
export type RangePickerProps<DateType extends object = Dayjs> = DateRangePickerProps<DateType>;

/** antd `DatePickerSemanticType`: the Semantic DOM `classNames` / `styles` shapes. */
export interface DatePickerSemanticType {
  classNames?: PickerSemanticClassNames;
  styles?: PickerSemanticStyles;
}

/**
 * A single-date picker component: `multiple` (as `IsMultiple`) picks `DateType[]` values,
 * otherwise `DateType`; a `value` / `defaultValue` infers `ValueType` directly.
 */
export interface SinglePickerComponent<
  DateType extends object,
  InnerProps = DatePickerBaseProps<DateType>,
> {
  <IsMultiple extends boolean = false, ValueType = IsMultiple extends true ? DateType[] : DateType>(
    props: PickerPropsWithMultiple<DateType, InnerProps, ValueType> & { multiple?: IsMultiple },
  ): ReactNode;
  displayName?: string;
}

export interface RangePickerComponent<DateType extends object> {
  (props: DateRangePickerProps<DateType>): ReactNode;
  displayName?: string;
}

/** What `generatePicker(generateConfig)` returns: DatePicker with its static pickers. */
export interface GeneratedDatePicker<
  DateType extends object,
> extends SinglePickerComponent<DateType> {
  MonthPicker: SinglePickerComponent<DateType, Omit<DatePickerBaseProps<DateType>, 'picker'>>;
  QuarterPicker: SinglePickerComponent<DateType, Omit<DatePickerBaseProps<DateType>, 'picker'>>;
  RangePicker: RangePickerComponent<DateType>;
  TimePicker: SinglePickerComponent<
    DateType,
    Omit<DatePickerBaseProps<DateType>, 'picker' | 'showTime'>
  >;
  WeekPicker: SinglePickerComponent<DateType, Omit<DatePickerBaseProps<DateType>, 'picker'>>;
  YearPicker: SinglePickerComponent<DateType, Omit<DatePickerBaseProps<DateType>, 'picker'>>;
}

/** The default `DatePicker` (Dayjs), with antd's pure panels and `generatePicker`. */
export interface DatePickerType extends GeneratedDatePicker<Dayjs> {
  /** Debug only: the popup panel rendered inline, always open (antd `render-panel`). */
  _InternalPanelDoNotUseOrYouWillBeFired: ComponentType<DatePickerProps<any>>;
  /** Debug only: the RangePicker popup panel rendered inline, always open. */
  _InternalRangePanelDoNotUseOrYouWillBeFired: ComponentType<DateRangePickerProps>;
  generatePicker: <DateType extends object>(
    generateConfig: GenerateConfig<DateType>,
  ) => GeneratedDatePicker<DateType>;
}
