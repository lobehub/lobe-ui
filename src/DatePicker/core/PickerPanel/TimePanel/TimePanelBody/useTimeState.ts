import * as React from 'react';

import useTimeInfo from '../../../hooks/useTimeInfo';
import type { SharedTimeProps } from '../../../interface';
import { isNonNullable } from '../../../utils/common';
import { formatValue } from '../../../utils/dateUtil';
import { usePanelContext } from '../../context';
import type { Unit } from './TimeColumn';

export function isAM(hour: number) {
  return hour < 12;
}

export default function useTimeState<DateType extends object = any>(
  props: SharedTimeProps<DateType>,
) {
  const { use12Hours: showMeridiem } = props;

  const {
    values,
    generateConfig,
    locale,
    onSelect,
    onHover = () => {},
    pickerValue,
  } = usePanelContext<DateType>();

  const value = values?.[0] || null;

  // ========================== Info ==========================
  const [getValidTime, rowHourUnits, getMinuteUnits, getSecondUnits, getMillisecondUnits] =
    useTimeInfo(generateConfig, props, value);

  // ========================= Value ==========================
  // PickerValue will tell which one to align on the top
  const getUnitValue = (
    func: 'getHour' | 'getMinute' | 'getSecond' | 'getMillisecond',
  ): [valueNum: number, pickerNum: number] => {
    const valueUnitVal = value && generateConfig[func](value);
    const pickerUnitValue = pickerValue && generateConfig[func](pickerValue);

    return [valueUnitVal!, pickerUnitValue];
  };

  const [hour, pickerHour] = getUnitValue('getHour');
  const [minute, pickerMinute] = getUnitValue('getMinute');
  const [second, pickerSecond] = getUnitValue('getSecond');
  const [millisecond, pickerMillisecond] = getUnitValue('getMillisecond');
  const meridiem = hour === null ? null : isAM(hour) ? 'am' : 'pm';

  // ========================= Column =========================
  // Hours
  const hourUnits = React.useMemo(() => {
    if (!showMeridiem) {
      return rowHourUnits;
    }

    return isAM(hour)
      ? rowHourUnits.filter((h) => isAM(h.value as number))
      : rowHourUnits.filter((h) => !isAM(h.value as number));
  }, [hour, rowHourUnits, showMeridiem]);

  // >>> Pick Fallback
  const getEnabled = (units: Unit<number>[], val: number) => {
    const enabledUnit = units.find((unit) => !unit.disabled);

    return (
      val ??
      // Fallback to enabled value
      enabledUnit?.value
    );
  };

  // >>> Minutes
  const validHour = getEnabled(rowHourUnits, hour);
  const minuteUnits = React.useMemo(() => getMinuteUnits(validHour), [getMinuteUnits, validHour]);

  // >>> Seconds
  const validMinute = getEnabled(minuteUnits, minute);
  const secondUnits = React.useMemo(
    () => getSecondUnits(validHour, validMinute),
    [getSecondUnits, validHour, validMinute],
  );

  // >>> Milliseconds
  const validSecond = getEnabled(secondUnits, second);
  const millisecondUnits = React.useMemo(
    () => getMillisecondUnits(validHour, validMinute, validSecond),
    [getMillisecondUnits, validHour, validMinute, validSecond],
  );

  const validMillisecond = getEnabled(millisecondUnits, millisecond);

  // Meridiem
  const meridiemUnits = React.useMemo(() => {
    if (!showMeridiem) {
      return [];
    }

    const base = generateConfig.getNow();
    const amDate = generateConfig.setHour(base, 9);
    const pmDate = generateConfig.setHour(base, 15);

    const formatMeridiem = (date: DateType, defaultLabel: string) => {
      const { cellMeridiemFormat } = locale;
      return cellMeridiemFormat
        ? formatValue(date, {
            generateConfig,
            locale,
            format: cellMeridiemFormat,
          })
        : defaultLabel;
    };

    return [
      {
        label: formatMeridiem(amDate, 'AM'),
        value: 'am',
        disabled: rowHourUnits.every((h) => h.disabled || !isAM(h.value as number)),
      },
      {
        label: formatMeridiem(pmDate, 'PM'),
        value: 'pm',
        disabled: rowHourUnits.every((h) => h.disabled || isAM(h.value as number)),
      },
    ];
  }, [rowHourUnits, showMeridiem, generateConfig, locale]);

  // ========================= Change =========================
  /**
   * Check if time is validate or will match to validate one
   */
  const triggerChange = (nextDate: DateType) => {
    const validateDate = getValidTime(nextDate);

    onSelect(validateDate);
  };

  // ========================= Column =========================
  // Create a template date for the trigger change event
  const triggerDateTmpl = React.useMemo(() => {
    let tmpl = value || pickerValue || generateConfig.getNow();

    if (isNonNullable(hour)) {
      tmpl = generateConfig.setHour(tmpl, hour);
      tmpl = generateConfig.setMinute(tmpl, minute);
      tmpl = generateConfig.setSecond(tmpl, second);
      tmpl = generateConfig.setMillisecond(tmpl, millisecond);
    } else if (isNonNullable(pickerHour)) {
      tmpl = generateConfig.setHour(tmpl, pickerHour);
      tmpl = generateConfig.setMinute(tmpl, pickerMinute);
      tmpl = generateConfig.setSecond(tmpl, pickerSecond);
      tmpl = generateConfig.setMillisecond(tmpl, pickerMillisecond);
    } else if (isNonNullable(validHour)) {
      tmpl = generateConfig.setHour(tmpl, validHour);
      tmpl = generateConfig.setMinute(tmpl, validMinute);
      tmpl = generateConfig.setSecond(tmpl, validSecond);
      tmpl = generateConfig.setMillisecond(tmpl, validMillisecond);
    }

    return tmpl;
  }, [
    value,
    pickerValue,
    hour,
    minute,
    second,
    millisecond,
    validHour,
    validMinute,
    validSecond,
    validMillisecond,
    pickerHour,
    pickerMinute,
    pickerSecond,
    pickerMillisecond,
    generateConfig,
  ]);

  // ===================== Columns Change =====================
  const fillColumnValue = (
    val: number | string | null,
    func: 'setHour' | 'setMinute' | 'setSecond' | 'setMillisecond',
  ) => {
    if (val === null) {
      return null;
    }
    return generateConfig[func](triggerDateTmpl, val as any);
  };

  const getNextHourTime = (val: number | null) => fillColumnValue(val, 'setHour');
  const getNextMinuteTime = (val: number | null) => fillColumnValue(val, 'setMinute');
  const getNextSecondTime = (val: number | null) => fillColumnValue(val, 'setSecond');
  const getNextMillisecondTime = (val: number | null) => fillColumnValue(val, 'setMillisecond');
  const getMeridiemTime = (val: string | null) => {
    if (val === null) {
      return null;
    }

    if (val === 'am' && !isAM(hour)) {
      return generateConfig.setHour(triggerDateTmpl, hour - 12);
    } else if (val === 'pm' && isAM(hour)) {
      return generateConfig.setHour(triggerDateTmpl, hour + 12);
    }
    return triggerDateTmpl;
  };

  const onHourChange = (val: number) => {
    triggerChange(getNextHourTime(val)!);
  };

  const onMinuteChange = (val: number) => {
    triggerChange(getNextMinuteTime(val)!);
  };

  const onSecondChange = (val: number) => {
    triggerChange(getNextSecondTime(val)!);
  };

  const onMillisecondChange = (val: number) => {
    triggerChange(getNextMillisecondTime(val)!);
  };

  const onMeridiemChange = (val: string) => {
    triggerChange(getMeridiemTime(val)!);
  };

  // ====================== Column Hover ======================
  const onHourHover = (val: number | null) => {
    onHover(getNextHourTime(val));
  };

  const onMinuteHover = (val: number | null) => {
    onHover(getNextMinuteTime(val));
  };

  const onSecondHover = (val: number | null) => {
    onHover(getNextSecondTime(val));
  };

  const onMillisecondHover = (val: number | null) => {
    onHover(getNextMillisecondTime(val));
  };

  const onMeridiemHover = (val: string | null) => {
    onHover(getMeridiemTime(val));
  };

  return {
    hour,
    hourUnits,
    meridiem,
    meridiemUnits,
    millisecond,
    millisecondUnits,
    minute,
    minuteUnits,
    onHourChange,
    onHourHover,
    onMeridiemChange,
    onMeridiemHover,
    onMillisecondChange,
    onMillisecondHover,
    onMinuteChange,
    onMinuteHover,
    onSecondChange,
    onSecondHover,
    pickerHour,
    pickerMillisecond,
    pickerMinute,
    pickerSecond,
    rowHourUnits,
    second,
    secondUnits,
    validHour,
    validMinute,
    validSecond,
  };
}
