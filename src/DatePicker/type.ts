import type { Dayjs } from 'dayjs';
import type { ComponentType, CSSProperties, FocusEvent, MouseEvent, ReactNode, Ref } from 'react';

import type {
  PickerProps as RcPickerProps,
  PickerRef,
  RangePickerProps as RcRangePickerProps,
} from './core';
import type { GenerateConfig } from './core/generate';
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
} from './core/interface';

export type {
  CellRender,
  CellRenderInfo,
  GenerateConfig,
  PanelMode,
  PickerMode,
  PickerRef,
  RangePickerRef,
};

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
export type PresetDate<T = Date> = ValueDate<T>;
/** `components`: replace a panel (`date` / `week` / … / `time`), the `input` or the OK `button`. */
export type PickerComponents = Components<Date>;
/** Props a custom panel in `components` receives (`value`, `onSelect`, `onHover`, …). */
export type PickerPanelProps<DateType extends object = Date> = SharedPanelProps<DateType>;

export type PickerSize = 'large' | 'medium' | 'small';
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
type InternalRcProps =
  'classNames' | 'generateConfig' | 'inlinePopup' | 'locale' | 'prefixCls' | 'styles';

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
export interface PickerTagProps<DateType extends object = Date> {
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
 * Date inputs the previous lobe DatePicker took (native `Date`), plus date strings and
 * timestamps. On the dayjs pickers they are converted to `Dayjs`; callbacks always get `Dayjs`.
 */
export type LegacyDateInput = Date | string | number;

/** A date prop value: `Dayjs` or a `LegacyDateInput` on the dayjs pickers, else `DateType`. */
export type PickerDateInput<DateType> = DateType extends Dayjs
  ? Dayjs | LegacyDateInput
  : DateType extends Date
    ? Dayjs | LegacyDateInput
    : DateType;

/** Range `onChange` dates: never `null` on the default (native `Date`) picker, as before. */
export type RangeChangeDates<DateType extends object> = DateType extends Date
  ? DateRangeValue<DateType>
  : DateRangeValue<DateType> | null;

export type RangeChangeStrings<DateType extends object> = DateType extends Date
  ? [string, string]
  : [string, string] | null;

/** `PickerDateInput` for a single value or each date of a `multiple` array. */
export type PickerValueInput<ValueType> = ValueType extends readonly (infer D)[]
  ? PickerDateInput<D>[]
  : PickerDateInput<ValueType>;

/**
 * antd's `PickerPropsWithMultiple`: `InnerPickerProps` with the value props typed by
 * `ValueType` — `DateType` for one date, `DateType[]` with `multiple`.
 */
export type PickerPropsWithMultiple<DateType, InnerPickerProps, ValueType = DateType> = Omit<
  InnerPickerProps,
  'defaultValue' | 'onCalendarChange' | 'onChange' | 'onOk' | 'value'
> & {
  /** Also takes a native `Date`, date string or timestamp (converted to `Dayjs`). */
  defaultValue?: PickerValueInput<ValueType> | null;
  // Callbacks use method syntax (bivariant params) so handlers written for the previous
  // lobe API, e.g. without `| null`, still type-check.
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onCalendarChange?(
    date: ValueType | null,
    dateString: PickerDateStrings<ValueType>,
    info: BaseInfo,
  ): void;
  /** Cleared: `null` for one date, `[]` with `multiple`. */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onChange?(date: ValueType | null, dateString: PickerDateStrings<ValueType>): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onOk?(date?: ValueType | null): void;
  /** Also takes a native `Date`, date string or timestamp (converted to `Dayjs`). */
  value?: PickerValueInput<ValueType> | null;
};

/**
 * DatePicker props other than the value ones, which `PickerPropsWithMultiple` adds.
 * `DateType` is the date library's type (`Dayjs`, or another one with `generatePicker`).
 */
export interface DatePickerBaseProps<DateType extends object = Date>
  extends
    Omit<RcPickerProps<DateType>, InternalRcProps | MultipleRcProps | ValueRcProps>,
    LobePickerProps {
  /** Semantic DOM class names: `root` / `prefix` / `input` / `suffix` and `popup.*`. */
  classNames?: PickerClassNames<DatePickerBaseProps<DateType>>;
  /**
   * antd `PickerLocale`: `lang` texts and formats (`fieldDateFormat`, `yearFormat`,
   * `shortWeekDays`, …) and `timePickerLocale`. Defaults to the locale generated from the
   * `@lobehub/ui/i18n` resources in context.
   */
  locale?: PickerLocaleInput;
  /**
   * `multiple`: at most this many tags; `'responsive'` fits as many as the width allows.
   * The rest collapse into a `+ N ...` tag.
   */
  maxTagCount?: number | 'responsive';
  /**
   * Pick several dates, shown as tags; clicking a picked cell again removes it. Works on
   * every `picker` except with `showTime`. Values are `Dayjs[]`, sorted unless
   * `order={false}`. No OK button (`needConfirm` defaults to `false`): `onCalendarChange`
   * fires on each click and `onChange` once the popup closes.
   */
  multiple?: boolean;
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
  styles?: PickerStyles<DatePickerBaseProps<DateType>>;
  /** `multiple`: render each picked date's tag, e.g. with base-ui `Tag`. */
  tagRender?: (props: PickerTagProps<DateType>) => ReactNode;
}

/**
 * `ValueType` is `Dayjs` (default) or `Dayjs[]` with `multiple`; `<DatePicker multiple>`
 * infers `Dayjs[]` by itself.
 */
export type DatePickerProps<ValueType = Date> = PickerPropsWithMultiple<
  Date,
  DatePickerBaseProps,
  ValueType
>;

export type DateRangeValue<DateType extends object = Date> = [DateType | null, DateType | null];

/** Which end of a range an event belongs to. */
export interface RangeInfo {
  range: 'start' | 'end';
}

/** `info.from` is the end picked first in the current range selection. */
export type RangeDisabledDate<DateType extends object = Date> = (
  current: DateType,
  info: { from?: DateType; type: PanelMode },
) => boolean;

type RangeRcProps =
  'allowEmpty' | 'disabled' | 'disabledDate' | 'id' | 'onBlur' | 'onFocus' | 'order';

export interface DateRangePickerProps<DateType extends object = Date>
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
  /** Each end also takes a native `Date`, date string or timestamp (converted to `Dayjs`). */
  defaultValue?: [
    PickerDateInput<DateType> | null | undefined,
    PickerDateInput<DateType> | null | undefined,
  ];
  /** Disable the whole picker, or each end separately with `[start, end]`. */
  disabled?: boolean | [boolean, boolean];
  /** Receives `info.from` once one end is picked, e.g. to limit the range length. */
  disabledDate?: RangeDisabledDate<DateType>;
  /** Ids of the start and end inputs. */
  id?: { end?: string; start?: string };
  /** antd `PickerLocale`, see `DatePickerProps['locale']`. */
  locale?: PickerLocaleInput;
  onBlur?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  // Method syntax (bivariant params): handlers written for the previous lobe API, e.g.
  // `([start, end]: DateRangeValue) => …` without `| null`, still type-check.
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onCalendarChange?(
    dates: DateRangeValue<DateType>,
    dateStrings: [string, string],
    info: RangeInfo,
  ): void;
  /** Cleared: `null` (antd). */
  /** Cleared: `[null, null]` on the default (native `Date`) picker, `null` on the dayjs one (antd). */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onChange?(dates: RangeChangeDates<DateType>, dateStrings: RangeChangeStrings<DateType>): void;
  onFocus?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onOk?(dates: DateRangeValue<DateType>): void;
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
  /** Each end also takes a native `Date`, date string or timestamp (converted to `Dayjs`). */
  value?:
    | [PickerDateInput<DateType> | null | undefined, PickerDateInput<DateType> | null | undefined]
    | null;
}

/* ------------------------- Static members and generatePicker ------------------------- */

/** antd `PickerProps<DateType>`: DatePicker props over any date library's type. */
export type PickerProps<
  DateType extends object = Date,
  ValueType = DateType,
> = PickerPropsWithMultiple<DateType, DatePickerBaseProps<DateType>, ValueType>;

/** Props of `DatePicker.WeekPicker` / `MonthPicker` / … : `picker` is fixed. */
export type PresetPickerProps<DateType extends object = Date, ValueType = DateType> = Omit<
  PickerProps<DateType, ValueType>,
  'picker'
>;

export type WeekPickerProps<ValueType = Date> = PresetPickerProps<Date, ValueType>;
export type MonthPickerProps<ValueType = Date> = PresetPickerProps<Date, ValueType>;
export type YearPickerProps<ValueType = Date> = PresetPickerProps<Date, ValueType>;
export type QuarterPickerProps<ValueType = Date> = PresetPickerProps<Date, ValueType>;

/** antd `GenericTimePickerProps`: `DatePicker.TimePicker` has no `picker` / `showTime`. */
export type GenericTimePickerProps<DateType extends object = Date, ValueType = DateType> = Omit<
  PickerProps<DateType, ValueType>,
  'picker' | 'showTime'
>;
export type TimePickerProps<ValueType = Date> = GenericTimePickerProps<Date, ValueType>;

/** antd-style alias of `DateRangePickerProps`. */
export type RangePickerProps<DateType extends object = Date> = DateRangePickerProps<DateType>;

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

/** The default `DatePicker` (native `Date`) or `DayjsDatePicker`, with antd's pure panels and `generatePicker`. */
export interface DatePickerType<D extends object = Date> extends GeneratedDatePicker<D> {
  /** Debug only: the popup panel rendered inline, always open (antd `render-panel`). */
  _InternalPanelDoNotUseOrYouWillBeFired: ComponentType<
    PickerPropsWithMultiple<D, DatePickerBaseProps<D>, any>
  >;
  /** Debug only: the RangePicker popup panel rendered inline, always open. */
  _InternalRangePanelDoNotUseOrYouWillBeFired: ComponentType<DateRangePickerProps<D>>;
  generatePicker: <DateType extends object>(
    generateConfig: GenerateConfig<DateType>,
  ) => GeneratedDatePicker<DateType>;
}

/** `DayjsDatePicker`: the antd-aligned DatePicker over `Dayjs`. */
export type DayjsDatePickerType = DatePickerType<Dayjs>;
/** `DayjsDatePicker` props: values and callbacks use `Dayjs` (`Dayjs[]` with `multiple`). */
export type DayjsDatePickerProps<ValueType = Dayjs> = PickerPropsWithMultiple<
  Dayjs,
  DatePickerBaseProps<Dayjs>,
  ValueType
>;
/** `DayjsDateRangePicker` props. */
export type DayjsDateRangePickerProps = DateRangePickerProps<Dayjs>;
/** `DayjsDateRangePicker` value: `[Dayjs | null, Dayjs | null]`. */
export type DayjsDateRangeValue = DateRangeValue<Dayjs>;
