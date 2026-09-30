import type { CSSProperties, ReactNode } from 'react';

import type { InputSize, InputVariant } from '@/base-ui/Input/type';

import type { CalendarMode } from './calendar';

interface PickerCommonProps {
  allowClear?: boolean;
  className?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  format?: string | ((date: Date) => string);
  max?: Date;
  min?: Date;
  shadow?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  variant?: InputVariant;
}

export interface DatePickerProps extends PickerCommonProps {
  defaultValue?: Date | null;
  footer?: ReactNode;
  mode?: CalendarMode;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  value?: Date | null;
}

export type DateRangeValue = [Date | null, Date | null];

export interface DateRangePickerProps extends PickerCommonProps {
  defaultValue?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  placeholder?: [string, string];
  value?: DateRangeValue;
}

export type { CalendarMode } from './calendar';
