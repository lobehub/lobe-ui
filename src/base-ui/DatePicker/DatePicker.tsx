'use client';

import RcPicker from '@rc-component/picker';
import type { Dayjs } from 'dayjs';

import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import type { DatePickerProps } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared } from './usePickerShared';

const DatePicker = (props: DatePickerProps) => {
  const {
    allowClear,
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
    dropdownClassName,
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
    needConfirm,
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
    popupClassName,
    popupStyle,
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
  } = props;
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
    changeOnBlur,
    className,
    clearIcon,
    classNames,
    components,
    defaultOpen,
    dropdownClassName,
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
    popupClassName,
    popupStyle,
    prevIcon,
    rootClassName: cx(keyboard.scopeClassName, rootClassName),
    semanticProps: props,
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
      locale={locale.lang}
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
