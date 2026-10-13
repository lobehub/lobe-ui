'use client';

import { RangePicker as RcRangePicker } from '@rc-component/picker';
import type { Dayjs } from 'dayjs';
import { ArrowRight } from 'lucide-react';

import Icon from '@/Icon';

import { usePickerLocale } from './locale';
import type { DateRangePickerProps } from './type';
import { usePickerShared } from './usePickerShared';

const DateRangePicker = ({
  allowClear,
  bordered,
  className,
  clearIcon,
  classNames,
  defaultOpen,
  getPopupContainer,
  locale: localeOverride,
  max,
  maxDate,
  min,
  minDate,
  nextIcon,
  onKeyDown,
  onCalendarChange,
  onChange,
  onOk,
  onOpenChange,
  open,
  picker,
  placeholder,
  prevIcon,
  rootClassName,
  separator,
  shadow,
  size,
  status,
  styles,
  suffixIcon,
  superNextIcon,
  superPrevIcon,
  transitionName,
  variant,
  ...rest
}: DateRangePickerProps) => {
  const { locale, rangePlaceholder } = usePickerLocale(localeOverride);
  const shared = usePickerShared({
    allowClear,
    bordered,
    className,
    clearIcon,
    classNames,
    defaultOpen,
    getPopupContainer,
    max,
    maxDate,
    min,
    minDate,
    nextIcon,
    onKeyDown,
    onOpenChange,
    open,
    picker,
    prevIcon,
    rootClassName,
    shadow,
    size,
    status,
    styles,
    suffixIcon,
    superNextIcon,
    superPrevIcon,
    transitionName,
    variant,
  });

  return (
    <RcRangePicker<Dayjs>
      {...rest}
      {...shared}
      locale={locale}
      picker={picker}
      placeholder={placeholder ?? rangePlaceholder}
      separator={separator ?? <Icon icon={ArrowRight} size={14} />}
      onCalendarChange={onCalendarChange as any}
      onChange={onChange}
      onOk={onOk as any}
    />
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
