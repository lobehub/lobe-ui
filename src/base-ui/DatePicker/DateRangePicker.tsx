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
  className,
  classNames,
  defaultOpen,
  getPopupContainer,
  locale: localeOverride,
  max,
  maxDate,
  min,
  minDate,
  nextIcon,
  onCalendarChange,
  onChange,
  onOk,
  onOpenChange,
  open,
  placeholder,
  prevIcon,
  rootClassName,
  separator,
  shadow,
  size,
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
    className,
    classNames,
    defaultOpen,
    getPopupContainer,
    max,
    maxDate,
    min,
    minDate,
    nextIcon,
    onOpenChange,
    open,
    prevIcon,
    rootClassName,
    shadow,
    size,
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
