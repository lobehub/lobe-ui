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
  allowEmpty,
  bordered,
  cellRender,
  changeOnBlur,
  className,
  clearIcon,
  classNames,
  components,
  dateRender,
  defaultOpen,
  defaultPickerValue,
  defaultValue,
  direction,
  disabled,
  disabledDate,
  footer,
  getPopupContainer,
  id,
  locale: localeOverride,
  max,
  maxDate,
  min,
  minDate,
  mode,
  monthCellRender,
  needConfirm,
  nextIcon,
  onBlur,
  onKeyDown,
  onCalendarChange,
  onChange,
  onFocus,
  onOk,
  onOpenChange,
  onPanelChange,
  onPickerValueChange,
  open,
  order,
  picker = 'date',
  pickerValue,
  placeholder,
  prevIcon,
  renderExtraFooter,
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
    changeOnBlur,
    className,
    clearIcon,
    classNames,
    components,
    defaultOpen,
    getPopupContainer,
    max,
    maxDate,
    min,
    minDate,
    needConfirm,
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
      allowEmpty={allowEmpty}
      cellRender={keyboard.cellRender}
      dateRender={dateRender}
      defaultPickerValue={defaultPickerValue as any}
      defaultValue={defaultValue as any}
      direction={direction}
      disabled={disabled}
      disabledDate={disabledDate}
      id={id}
      locale={locale}
      mode={mode as any}
      monthCellRender={monthCellRender}
      order={order}
      picker={picker}
      pickerValue={keyboard.pickerValue}
      placeholder={placeholder ?? rangePlaceholder(picker)}
      renderExtraFooter={renderExtraFooter ?? (footer ? () => footer : undefined)}
      separator={separator ?? <Icon icon={ArrowRight} size={14} />}
      value={value as any}
      onBlur={onBlur as any}
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
