'use client';

import RcPicker from '@rc-component/picker';
import type { GenerateConfig } from '@rc-component/picker/generate';
import type { PickerMode } from '@rc-component/picker/interface';
import { X } from 'lucide-react';

import Icon from '@/Icon';
import { cx } from '@/utils/styleEngine';

import { usePickerLocale } from './locale';
import { PREFIX_CLS } from './style';
import type { GeneratedDatePicker, PickerProps, SinglePickerComponent } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared, withDefault } from './usePickerShared';

const defaultRemoveIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

/**
 * antd `generateSinglePicker`: DatePicker over `generateConfig`'s date type, plus the
 * pickers whose `picker` is fixed (`DatePicker.WeekPicker`, …, `DatePicker.TimePicker`).
 */
const generateSinglePicker = <DateType extends object>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const getPicker = (presetPicker?: PickerMode, displayName = 'DatePicker') => {
    const Picker = (props: PickerProps<DateType, any>) => {
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
        picker: pickerProp,
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
      const picker = presetPicker ?? pickerProp ?? 'date';
      const { locale, placeholder: defaultPlaceholder } = usePickerLocale(localeOverride);
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
        <RcPicker<DateType>
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
    };
    Picker.displayName = displayName;
    return Picker as SinglePickerComponent<DateType, any>;
  };

  return {
    DatePicker: getPicker() as GeneratedDatePicker<DateType>,
    MonthPicker: getPicker('month', 'MonthPicker'),
    QuarterPicker: getPicker('quarter', 'QuarterPicker'),
    TimePicker: getPicker('time', 'TimePicker'),
    WeekPicker: getPicker('week', 'WeekPicker'),
    YearPicker: getPicker('year', 'YearPicker'),
  };
};

export default generateSinglePicker;
