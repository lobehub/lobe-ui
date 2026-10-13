'use client';

import RcPicker from '@rc-component/picker';
import type { Dayjs } from 'dayjs';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import Icon from '@/Icon';
import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import { PREFIX_CLS } from './style';
import type { DatePickerProps } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared, withDefault } from './usePickerShared';

/**
 * One generic signature: `multiple` (as `IsMultiple`) picks `Dayjs[]` values, otherwise
 * `Dayjs`; a `value` / `defaultValue` infers `ValueType` directly.
 */
export interface DatePickerComponent {
  <IsMultiple extends boolean = false, ValueType = IsMultiple extends true ? Dayjs[] : Dayjs>(
    props: DatePickerProps<ValueType> & { multiple?: IsMultiple },
  ): ReactNode;
  displayName?: string;
}

const defaultRemoveIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

const DatePicker = ((props: DatePickerProps<any>) => {
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
    multiple,
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
    removeIcon,
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
      multiple={multiple}
      picker={picker}
      pickerValue={keyboard.pickerValue}
      placeholder={placeholder ?? defaultPlaceholder(picker)}
      ref={ref}
      removeIcon={withDefault(removeIcon, defaultRemoveIcon)}
      renderExtraFooter={renderExtraFooter ?? (footer ? () => footer : undefined)}
      value={value as any}
      classNames={
        multiple
          ? {
              ...shared.classNames,
              popup: {
                ...shared.classNames.popup,
                root: cx(shared.classNames.popup.root, `${PREFIX_CLS}-dropdown-multiple`),
              },
            }
          : shared.classNames
      }
      onChange={keyboard.onChange}
      onFocus={keyboard.onFocus}
      onOk={onOk as any}
      onPanelChange={keyboard.onPanelChange}
      onPickerValueChange={keyboard.onPickerValueChange}
      onCalendarChange={
        onCalendarChange || onSelect
          ? (date, dateString, info) => {
              onCalendarChange?.(date, dateString as any, info);
              if (date && !Array.isArray(date)) onSelect?.(date);
            }
          : undefined
      }
    />
  );
}) as DatePickerComponent;

DatePicker.displayName = 'DatePicker';

export default DatePicker;
