'use client';

import RcPicker from '@rc-component/picker';
import type { Dayjs } from 'dayjs';

import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import type { DatePickerProps } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared } from './usePickerShared';

const DatePicker = ({
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
  footer,
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
  onSelect,
  open,
  picker = 'date',
  pickerValue,
  placeholder,
  prevIcon,
  ref,
  renderExtraFooter,
  rootClassName,
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
}: DatePickerProps) => {
  const { locale, placeholder: defaultPlaceholder } = usePickerLocale(localeOverride);
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
    <RcPicker<Dayjs>
      {...rest}
      {...shared}
      cellRender={keyboard.cellRender}
      dateRender={dateRender}
      defaultPickerValue={defaultPickerValue as any}
      defaultValue={defaultValue ?? undefined}
      direction={direction}
      locale={locale}
      mode={mode as any}
      monthCellRender={monthCellRender}
      picker={picker}
      pickerValue={keyboard.pickerValue}
      placeholder={placeholder ?? defaultPlaceholder(picker)}
      ref={ref}
      renderExtraFooter={renderExtraFooter ?? (footer ? () => footer : undefined)}
      value={value as any}
      onChange={keyboard.onChange}
      onFocus={keyboard.onFocus}
      onOk={onOk as any}
      onPanelChange={keyboard.onPanelChange}
      onPickerValueChange={keyboard.onPickerValueChange}
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
