'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';

import Icon from '@/Icon';

import A2uiDatePicker from './A2uiDatePicker';
import RcPicker from './core';
import type { GenerateConfig } from './core/generate';
import type { PickerMode } from './core/interface';
import { normalizeLegacyDateProps } from './legacyDate';
import { usePickerLocale } from './locale';
import { datePickerClasses } from './stable';
import { PREFIX_CLS } from './style';
import type { GeneratedDatePicker, PickerProps, SinglePickerComponent } from './type';
import { usePanelKeyboard } from './usePanelKeyboard';
import { usePickerShared, withDefault } from './usePickerShared';
import { usePresetActive } from './usePresetActive';

const defaultRemoveIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

const generateSinglePicker = <DateType extends object>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const getPicker = (presetPicker?: PickerMode, displayName = 'DatePicker') => {
    const DefaultPicker = (rawProps: PickerProps<DateType, any>) => {
      const props = normalizeLegacyDateProps(rawProps, generateConfig);
      const {
        allowClear,
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
        getPopupContainer,
        locale: localeOverride,
        maxDate,
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
        value,
        variant,
        // `label` is the a2ui field label; the default picker has none.
        label: _label,
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
        stable: datePickerClasses,
        allowClear,
        changeOnBlur,
        className,
        clearIcon,
        classNames,
        components,
        defaultOpen,
        dropdownClassName,
        generateConfig,
        getPopupContainer,
        maxDate,
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
        rootClassName: clsx(keyboard.scopeClassName, rootClassName),
        semanticProps: props,
        shadow,
        size,
        status,
        styles,
        suffixIcon,
        superNextIcon,
        superPrevIcon,
        variant: variant as Exclude<typeof variant, 'a2ui'>,
      });

      const presetActive = usePresetActive(
        (rest as any).presets,
        multiple ? undefined : value,
        multiple ? undefined : defaultValue,
      );

      return (
        <RcPicker<DateType>
          {...rest}
          {...shared}
          presets={presetActive.presets as any}
          // No footer row by default: Today / Now only when asked for (showNow or the
          // deprecated showToday); showTime + needConfirm still shows OK.
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
          renderExtraFooter={renderExtraFooter}
          showNow={(rest as any).showNow ?? (rest as any).showToday ?? false}
          value={value as any}
          classNames={
            multiple
              ? {
                  ...shared.classNames,
                  popup: {
                    ...shared.classNames.popup,
                    root: clsx(shared.classNames.popup.root, `${PREFIX_CLS}-dropdown-multiple`),
                  },
                }
              : shared.classNames
          }
          onCalendarChange={onCalendarChange as any}
          onFocus={keyboard.onFocus}
          onOk={onOk as any}
          onPanelChange={keyboard.onPanelChange}
          onPickerValueChange={keyboard.onPickerValueChange}
          onChange={(...args: any[]) => {
            presetActive.track(args[0]);
            (keyboard.onChange as any)(...args);
          }}
        />
      );
    };
    // `variant="a2ui"` on a single-date picker: the A2UI playground trigger and calendar.
    const Picker = (rawProps: PickerProps<DateType, any>) => {
      const picker = presetPicker ?? rawProps.picker ?? 'date';
      if (rawProps.variant !== 'a2ui' || picker !== 'date' || rawProps.multiple)
        return <DefaultPicker {...rawProps} />;
      const props = normalizeLegacyDateProps(rawProps, generateConfig);
      return (
        <A2uiDatePicker<DateType>
          className={clsx(props.className, props.rootClassName)}
          defaultOpen={props.defaultOpen}
          defaultValue={props.defaultValue as DateType | null | undefined}
          disabled={props.disabled as boolean | undefined}
          disabledDate={props.disabledDate as ((date: DateType) => boolean) | undefined}
          generateConfig={generateConfig}
          id={props.id}
          label={props.label}
          maxDate={props.maxDate}
          minDate={props.minDate}
          open={props.open}
          placeholder={props.placeholder as string | undefined}
          style={props.style}
          value={props.value as DateType | null | undefined}
          onOpenChange={props.onOpenChange}
          onChange={
            props.onChange as ((date: DateType | null, dateString: string) => void) | undefined
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
