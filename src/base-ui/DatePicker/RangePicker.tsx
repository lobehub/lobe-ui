'use client';

import { RangePicker as RcRangePicker } from '@rc-component/picker';
import type { GenerateConfig } from '@rc-component/picker/generate';
import { ArrowRight } from 'lucide-react';

import Icon from '@/Icon';
import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import type { DateRangePickerProps, RangePickerComponent } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared } from './usePickerShared';

/** antd `generateRangePicker`: `DatePicker.RangePicker` over `generateConfig`'s date type. */
const generateRangePicker = <DateType extends object>(generateConfig: GenerateConfig<DateType>) => {
  const RangePicker = (props: DateRangePickerProps<DateType>) => {
    const {
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
      dropdownClassName,
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
      popupClassName,
      popupStyle,
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
    } = props;
    const { locale, rangePlaceholder } = usePickerLocale(localeOverride);
    const keyboard = usePanelKeyboard({
      cellRender,
      dateRender,
      defaultOpen,
      defaultPickerValue,
      defaultValue,
      direction,
      generateConfig,
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
      dropdownClassName,
      generateConfig,
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
      <RcRangePicker<DateType>
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
        locale={locale.lang}
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
  RangePicker.displayName = 'RangePicker';
  return RangePicker as RangePickerComponent<DateType>;
};

export default generateRangePicker;
