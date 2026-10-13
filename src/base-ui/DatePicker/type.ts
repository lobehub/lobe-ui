import type {
  PickerProps as RcPickerProps,
  PickerRef,
  RangePickerProps as RcRangePickerProps,
} from '@rc-component/picker';
import type {
  BaseInfo,
  Locale,
  PanelMode,
  PickerMode,
  RangePickerRef,
} from '@rc-component/picker/interface';
import type { Dayjs } from 'dayjs';
import type { ReactNode, Ref } from 'react';

import type { InputSize, InputVariant } from '@/base-ui/Input/type';

export type { PanelMode, PickerMode, PickerRef, RangePickerRef };

/** @deprecated Use `PickerMode` (the `picker` prop) instead. */
export type CalendarMode = 'date' | 'month' | 'year';

/** Props rc-picker owns internally or that lobe wires up itself. */
type InternalRcProps = 'generateConfig' | 'locale' | 'prefixCls';

/** Multiple selection is not part of the single-value API yet. */
type MultipleRcProps = 'maxTagCount' | 'multiple' | 'removeIcon' | 'tagRender';

type ValueRcProps =
  'defaultValue' | 'onCalendarChange' | 'onChange' | 'onOk' | 'placeholder' | 'size' | 'value';

interface LobePickerProps {
  /** Lobe look: drop shadow under the input box. */
  shadow?: boolean;
  /** @default 'middle' */
  size?: InputSize;
  /** @default 'outlined' (light) / 'filled' (dark) */
  variant?: InputVariant;
}

export interface DatePickerProps
  extends
    Omit<RcPickerProps<Dayjs>, InternalRcProps | MultipleRcProps | ValueRcProps>,
    LobePickerProps {
  defaultValue?: Dayjs | null;
  /** @deprecated Use `renderExtraFooter` instead. */
  footer?: ReactNode;
  /** Overrides individual fields of the rc-picker locale. */
  locale?: Partial<Locale>;
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

export interface DateRangePickerProps
  extends Omit<RcRangePickerProps<Dayjs>, InternalRcProps | ValueRcProps>, LobePickerProps {
  defaultValue?: [Dayjs | null | undefined, Dayjs | null | undefined];
  locale?: Partial<Locale>;
  /** @deprecated Use `maxDate` instead. */
  max?: Dayjs;
  /** @deprecated Use `minDate` instead. */
  min?: Dayjs;
  onCalendarChange?: (dates: DateRangeValue, dateStrings: [string, string], info: BaseInfo) => void;
  onChange?: (dates: DateRangeValue | null, dateStrings: [string, string] | null) => void;
  onOk?: (dates: DateRangeValue) => void;
  placeholder?: [string, string];
  ref?: Ref<RangePickerRef>;
  value?: [Dayjs | null | undefined, Dayjs | null | undefined] | null;
}

/** antd-style aliases. */
export type RangePickerProps = DateRangePickerProps;
