'use client';

import RcPicker from '@rc-component/picker';
import type { Dayjs } from 'dayjs';

import { usePickerLocale } from './locale';
import type { DatePickerProps } from './type';
import { usePickerShared } from './usePickerShared';

const DatePicker = ({
  allowClear,
  className,
  classNames,
  defaultOpen,
  defaultValue,
  footer,
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
  onSelect,
  open,
  picker = 'date',
  placeholder,
  prevIcon,
  ref,
  renderExtraFooter,
  rootClassName,
  shadow,
  size,
  styles,
  suffixIcon,
  superNextIcon,
  superPrevIcon,
  transitionName,
  variant,
  ...rest
}: DatePickerProps) => {
  const { locale, placeholder: defaultPlaceholder } = usePickerLocale(localeOverride);
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
    <RcPicker<Dayjs>
      {...rest}
      {...shared}
      defaultValue={defaultValue ?? undefined}
      locale={locale}
      picker={picker}
      placeholder={placeholder ?? defaultPlaceholder(picker)}
      ref={ref}
      renderExtraFooter={renderExtraFooter ?? (footer ? () => footer : undefined)}
      onChange={onChange as any}
      onOk={onOk as any}
      onCalendarChange={
        onCalendarChange || onSelect
          ? (date, dateString, info) => {
              onCalendarChange?.(date as Dayjs | null, dateString as string | null, info);
              if (date) onSelect?.(date as Dayjs);
            }
          : undefined
      }
    />
  );
};

DatePicker.displayName = 'DatePicker';

export default DatePicker;
