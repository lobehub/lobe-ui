import type {
  PickerProps as RcPickerProps,
  PickerRef,
  RangePickerProps as RcRangePickerProps,
} from '@rc-component/picker';
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
import type { FocusEvent, ReactNode, Ref } from 'react';

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

/** Props rc-picker owns internally or that lobe wires up itself. */
type InternalRcProps = 'generateConfig' | 'locale' | 'prefixCls';

/** Multiple selection is not part of the single-value API yet. */
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
  /**
   * Popup position relative to the input.
   * @default 'bottomLeft' ('bottomRight' when `direction="rtl"`)
   */
  placement?: PickerPlacement;
  /** Lobe look: drop shadow under the input box. */
  shadow?: boolean;
  /** @default 'medium' */
  size?: PickerSize;
  status?: PickerStatus;
  /** @default 'outlined' (light) / 'filled' (dark) */
  variant?: PickerVariant;
}

export interface DatePickerProps
  extends
    Omit<RcPickerProps<Dayjs>, InternalRcProps | MultipleRcProps | ValueRcProps>,
    LobePickerProps {
  defaultValue?: Dayjs | null;
  /** @deprecated Use `renderExtraFooter` instead. */
  footer?: ReactNode;
  /**
   * antd `PickerLocale`: `lang` texts and formats (`fieldDateFormat`, `yearFormat`,
   * `shortWeekDays`, …) and `timePickerLocale`. Defaults to the locale generated from the
   * `@lobehub/ui/i18n` resources in context.
   */
  locale?: PickerLocaleInput;
  /** @deprecated Use `maxDate` instead. */
  max?: Dayjs;
  /** @deprecated Use `minDate` instead. */
  min?: Dayjs;
  onCalendarChange?: (date: Dayjs | null, dateString: string | null, info: BaseInfo) => void;
  onChange?: (date: Dayjs | null, dateString: string | null) => void;
  onOk?: (date?: Dayjs | null) => void;
  /** @deprecated Use `onCalendarChange` instead. */
  onSelect?: (date: Dayjs) => void;
  placeholder?: string;
  ref?: Ref<PickerRef>;
  value?: Dayjs | null;
}

export type DateRangeValue = [Dayjs | null, Dayjs | null];

/** Which end of a range an event belongs to. */
export interface RangeInfo {
  range: 'start' | 'end';
}

/** `info.from` is the end picked first in the current range selection. */
export type RangeDisabledDate = (
  current: Dayjs,
  info: { from?: Dayjs; type: PanelMode },
) => boolean;

type RangeRcProps =
  'allowEmpty' | 'disabled' | 'disabledDate' | 'id' | 'onBlur' | 'onFocus' | 'order';

export interface DateRangePickerProps
  extends
    Omit<RcRangePickerProps<Dayjs>, InternalRcProps | RangeRcProps | ValueRcProps>,
    LobePickerProps {
  /**
   * Allow leaving the start / end empty; `true` applies to both ends.
   * @default [false, false]
   */
  allowEmpty?: boolean | [boolean, boolean];
  defaultValue?: [Dayjs | null | undefined, Dayjs | null | undefined];
  /** Disable the whole picker, or each end separately with `[start, end]`. */
  disabled?: boolean | [boolean, boolean];
  /** Receives `info.from` once one end is picked, e.g. to limit the range length. */
  disabledDate?: RangeDisabledDate;
  /** @deprecated Use `renderExtraFooter` instead. */
  footer?: ReactNode;
  /** Ids of the start and end inputs. */
  id?: { end?: string; start?: string };
  /** antd `PickerLocale`, see `DatePickerProps['locale']`. */
  locale?: PickerLocaleInput;
  /** @deprecated Use `maxDate` instead. */
  max?: Dayjs;
  /** @deprecated Use `minDate` instead. */
  min?: Dayjs;
  onBlur?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  onCalendarChange?: (
    dates: DateRangeValue,
    dateStrings: [string, string],
    info: RangeInfo,
  ) => void;
  onChange?: (dates: DateRangeValue | null, dateStrings: [string, string] | null) => void;
  onFocus?: (event: FocusEvent<HTMLElement>, info: RangeInfo) => void;
  onOk?: (dates: DateRangeValue) => void;
  /**
   * Swap the ends when the end is earlier than the start; `false` keeps them as entered.
   * @default true
   */
  order?: boolean;
  placeholder?: [string, string];
  /** `focus(index)` / `focus({ index })` focuses the start (`0`) or end (`1`) input. */
  ref?: Ref<RangePickerRef>;
  value?: [Dayjs | null | undefined, Dayjs | null | undefined] | null;
}

/** antd-style aliases. */
export type RangePickerProps = DateRangePickerProps;
