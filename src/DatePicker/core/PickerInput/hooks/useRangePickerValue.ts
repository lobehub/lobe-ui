import * as React from 'react';

import type { GenerateConfig } from '../../generate';
import { useControlledState, useLayoutEffect } from '../../hooks/react';
import type { InternalMode, Locale, NullableDateType, PanelMode } from '../../interface';
import { fillTime, isSame } from '../../utils/dateUtil';
import type { RangePickerProps } from '../RangePicker';

export function offsetPanelDate<DateType = any>(
  generateConfig: GenerateConfig<DateType>,
  picker: InternalMode,
  date: DateType,
  offset: number,
) {
  switch (picker) {
    case 'date':
    case 'week': {
      return generateConfig.addMonth(date, offset);
    }

    case 'month':
    case 'quarter': {
      return generateConfig.addYear(date, offset);
    }

    case 'year': {
      return generateConfig.addYear(date, offset * 10);
    }

    case 'decade': {
      return generateConfig.addYear(date, offset * 100);
    }

    default: {
      return date;
    }
  }
}

const EMPTY_LIST: unknown[] = [];

export default function useRangePickerValue<DateType extends object>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  calendarValue: NullableDateType<DateType>[],
  modes: PanelMode[],
  open: boolean,
  preserveOnFieldChange: boolean,
  activeIndex: number,
  pickerMode: InternalMode,
  multiplePanel: boolean,
  defaultPickerValue: DateType[] = EMPTY_LIST as DateType[],
  pickerValue: DateType[] = EMPTY_LIST as DateType[],
  // This is legacy from origin logic.
  // We will take `showTime.defaultValue` as the part of `pickerValue`
  timeDefaultValue: DateType[] = EMPTY_LIST as DateType[],
  onPickerValueChange?: RangePickerProps<DateType>['onPickerValueChange'],
  minDate?: DateType,
  maxDate?: DateType,
): [currentIndexPickerValue: DateType, setCurrentIndexPickerValue: (value: DateType) => void] {
  const isTimePicker = pickerMode === 'time';

  // ======================== Active ========================
  // `activeIndex` must be valid to avoid getting empty `pickerValue`
  const mergedActiveIndex = activeIndex || 0;
  const [startCalendarValue, endCalendarValue] = calendarValue;
  const activeCalendarValue = mergedActiveIndex === 0 ? startCalendarValue : endCalendarValue;
  const inactiveCalendarValue = mergedActiveIndex === 0 ? endCalendarValue : startCalendarValue;

  // ===================== Picker Value =====================
  const getDefaultPickerValue = (index: number) => {
    let now = generateConfig.getNow();
    if (isTimePicker) {
      now = fillTime(generateConfig, now);
    }

    const calendarDate = index === 0 ? startCalendarValue : endCalendarValue;
    return defaultPickerValue[index] || calendarDate || now;
  };

  // Align `pickerValue` with `showTime.defaultValue`
  const [startPickerValue, endPickerValue] = pickerValue;

  // PickerValue state
  const [mergedStartPickerValue, setStartPickerValue] = useControlledState(
    () => getDefaultPickerValue(0),
    startPickerValue,
  );

  const [mergedEndPickerValue, setEndPickerValue] = useControlledState(
    () => getDefaultPickerValue(1),
    endPickerValue,
  );

  // Current PickerValue
  const currentPickerValue = React.useMemo(() => {
    const current = [mergedStartPickerValue, mergedEndPickerValue][mergedActiveIndex];

    // Merge the `showTime.defaultValue` into `pickerValue`
    return isTimePicker
      ? current
      : fillTime(generateConfig, current, timeDefaultValue[mergedActiveIndex]);
  }, [
    isTimePicker,
    mergedStartPickerValue,
    mergedEndPickerValue,
    mergedActiveIndex,
    generateConfig,
    timeDefaultValue,
  ]);

  const setCurrentPickerValue = (
    nextPickerValue: DateType,
    source: 'reset' | 'panel' = 'panel',
  ) => {
    const updater = [setStartPickerValue, setEndPickerValue][mergedActiveIndex];
    updater(nextPickerValue);

    const clone: [DateType, DateType] = [mergedStartPickerValue, mergedEndPickerValue];
    clone[mergedActiveIndex] = nextPickerValue;

    if (
      onPickerValueChange &&
      (!isSame(generateConfig, locale, mergedStartPickerValue, clone[0], pickerMode) ||
        !isSame(generateConfig, locale, mergedEndPickerValue, clone[1], pickerMode))
    ) {
      onPickerValueChange(clone, {
        source,
        range: mergedActiveIndex === 1 ? 'end' : 'start',
        mode: modes as any,
      });
    }
  };

  // ======================== Effect ========================
  // Check whether two dates belong to the same panel.
  // 判断两个日期是否属于同一个面板。
  const isSamePanel = (date1: DateType, date2: DateType) => {
    if (pickerMode === 'year') {
      return (
        Math.floor(generateConfig.getYear(date1) / 10) ===
        Math.floor(generateConfig.getYear(date2) / 10)
      );
    }

    const panelMode: PanelMode =
      pickerMode === 'month' || pickerMode === 'quarter' ? 'year' : 'month';
    return isSame(generateConfig, locale, date1, date2, panelMode);
  };

  // Keep both values in the two visible panels when possible. Otherwise put
  // the end value in the second panel.
  // 尽量在双面板内同时展示两个值；无法容纳时，将 end 值放在右侧面板。
  const getEndDatePickerValue = (startDate: NullableDateType<DateType>, endDate: DateType) => {
    if (!multiplePanel || !startDate) {
      return endDate;
    }

    const nextPanelDate = offsetPanelDate(generateConfig, pickerMode, startDate, 1);
    const endInPanels = isSamePanel(startDate, endDate) || isSamePanel(nextPanelDate, endDate);

    return endInPanels ? startDate : offsetPanelDate(generateConfig, pickerMode, endDate, -1);
  };

  // >>> When switch field, reset the picker value as prev field picker value
  const prevActiveIndexRef = React.useRef<number>(null);
  useLayoutEffect(() => {
    if (open && !defaultPickerValue[mergedActiveIndex]) {
      let nextPickerValue: NullableDateType<DateType> = isTimePicker
        ? null
        : generateConfig.getNow();

      /**
       * 1. If focus switches inside the open Picker, keep the current panels
       * 2. If current field has value, sync it to the panels
       *    - Start: use the start value
       *    - End: keep start when both values fit, otherwise put end on the second panel
       * 3. If current field has no value but another field has value, use another field value
       * 4. Else use now (not any `calendarValue` can ref)
       */

      if (
        preserveOnFieldChange &&
        prevActiveIndexRef.current !== null &&
        prevActiveIndexRef.current !== mergedActiveIndex
      ) {
        // If from another field, not jump picker value
        nextPickerValue = [mergedStartPickerValue, mergedEndPickerValue][mergedActiveIndex ^ 1];
      } else if (activeCalendarValue) {
        // Current field has value
        nextPickerValue =
          mergedActiveIndex === 0
            ? startCalendarValue
            : getEndDatePickerValue(startCalendarValue, endCalendarValue!);
      } else if (inactiveCalendarValue) {
        // Current field has no value but another field has value
        nextPickerValue = inactiveCalendarValue;
      }

      // Only sync when has value, this will sync in the `min-max` logic
      if (nextPickerValue) {
        // nextPickerValue < minDate
        if (minDate && generateConfig.isAfter(minDate, nextPickerValue)) {
          nextPickerValue = minDate;
        }

        // maxDate < nextPickerValue
        const offsetPickerValue = multiplePanel
          ? offsetPanelDate(generateConfig, pickerMode, nextPickerValue, 1)
          : nextPickerValue;
        if (maxDate && generateConfig.isAfter(offsetPickerValue, maxDate)) {
          nextPickerValue = multiplePanel
            ? offsetPanelDate(generateConfig, pickerMode, maxDate, -1)
            : maxDate;
        }

        setCurrentPickerValue(nextPickerValue, 'reset');
      }
    }
  }, [open, preserveOnFieldChange, mergedActiveIndex, calendarValue[mergedActiveIndex]]);

  // >>> Track previous field only during one continuous Picker focus session
  React.useEffect(() => {
    if (open && preserveOnFieldChange) {
      prevActiveIndexRef.current = mergedActiveIndex;
    } else {
      prevActiveIndexRef.current = null;
    }
  }, [open, preserveOnFieldChange, mergedActiveIndex]);

  // >>> defaultPickerValue: Resync to `defaultPickerValue` for each panel focused
  useLayoutEffect(() => {
    if (open && defaultPickerValue && defaultPickerValue[mergedActiveIndex]) {
      setCurrentPickerValue(defaultPickerValue[mergedActiveIndex], 'reset');
    }
  }, [open, mergedActiveIndex]);

  return [currentPickerValue, setCurrentPickerValue];
}
