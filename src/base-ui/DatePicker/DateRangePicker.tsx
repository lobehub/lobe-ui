'use client';

import { RangePicker as RcRangePicker } from '@rc-component/picker';
import type { Dayjs } from 'dayjs';
import { ArrowRight } from 'lucide-react';

import Icon from '@/Icon';
import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import type { DateRangePickerProps } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared } from './usePickerShared';

const DateRangePicker = ({
  allowClear,
  bordered,
  cellRender,
  className,
  clearIcon,
  classNames,
  dateRender,
  defaultOpen,
  defaultPickerValue,
  defaultValue,
  direction,
  getPopupContainer,
  locale: localeOverride,
  max,
  maxDate,
  min,
  minDate,
  mode,
  monthCellRender,
  nextIcon,
  onKeyDown,
  onCalendarChange,
  onChange,
  onFocus,
  onOk,
  onOpenChange,
  onPanelChange,
  onPickerValueChange,
  open,
  picker = 'date',
  pickerValue,
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
  value,
  variant,
  ...rest
}: DateRangePickerProps) => {
  const { locale, rangePlaceholder } = usePickerLocale(localeOverride);
  const keyboard = usePanelKeyboard({
    cellRender,
    dateRender,
    defaultOpen,
    defaultPickerValue,
    defaultValue,
    direction,
    mode,
    monthCellRender,
    onChange,
    onFocus,
    onOpenChange,
    onPanelChange,
    onPickerValueChange,
    open,
    picker,
    pickerValue,
    range: true,
    value,
  });
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
    onOpenChange: keyboard.onOpenChange,
    open,
    picker,
    prevIcon,
    rootClassName: cx(keyboard.scopeClassName, rootClassName),
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
      cellRender={keyboard.cellRender}
      dateRender={dateRender}
      defaultPickerValue={defaultPickerValue as any}
      defaultValue={defaultValue as any}
      direction={direction}
      locale={locale}
      mode={mode as any}
      monthCellRender={monthCellRender}
      picker={picker}
      pickerValue={keyboard.pickerValue}
      placeholder={placeholder ?? rangePlaceholder(picker)}
      separator={separator ?? <Icon icon={ArrowRight} size={14} />}
      value={value as any}
      onCalendarChange={onCalendarChange as any}
      onChange={keyboard.onChange}
      onFocus={keyboard.onFocus}
      onOk={onOk as any}
      onPanelChange={keyboard.onPanelChange}
      onPickerValueChange={keyboard.onPickerValueChange}
    />
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
