import React from 'react';

import type { Locale, SharedTimeProps } from '../interface';

export function fillTimeFormat(
  showHour: boolean | undefined,
  showMinute: boolean | undefined,
  showSecond: boolean | undefined,
  showMillisecond: boolean | undefined,
  showMeridiem: boolean | undefined,
) {
  // Base HH:mm:ss
  const cells: string[] = [];

  if (showHour) {
    cells.push(showMeridiem ? 'hh' : 'HH');
  }
  if (showMinute) {
    cells.push('mm');
  }
  if (showSecond) {
    cells.push('ss');
  }

  let timeFormat = cells.join(':');

  // Millisecond
  if (showMillisecond) {
    timeFormat += '.SSS';
  }

  // Meridiem
  if (showMeridiem) {
    timeFormat += ' A';
  }

  return timeFormat;
}

/**
 * Used for `useFilledProps` since it already in the React.useMemo
 */
function fillLocale(
  locale: Locale,
  showHour: boolean | undefined,
  showMinute: boolean | undefined,
  showSecond: boolean | undefined,
  showMillisecond: boolean | undefined,
  use12Hours: boolean | undefined,
): Locale {
  // Not fill `monthFormat` since `locale.shortMonths` handle this
  // Not fill `cellMeridiemFormat` since AM & PM by default
  const {
    // Input Field
    fieldDateTimeFormat,
    fieldDateFormat,
    fieldTimeFormat,
    fieldMonthFormat,
    fieldYearFormat,
    fieldWeekFormat,
    fieldQuarterFormat,

    // Header Format
    yearFormat,
    // monthFormat,

    // Cell format
    cellYearFormat,
    cellQuarterFormat,
    dayFormat,
    cellDateFormat,

    // cellMeridiemFormat,
  } = locale;

  const timeFormat = fillTimeFormat(showHour, showMinute, showSecond, showMillisecond, use12Hours);

  return {
    ...locale,

    fieldDateTimeFormat: fieldDateTimeFormat || `YYYY-MM-DD ${timeFormat}`,
    fieldDateFormat: fieldDateFormat || 'YYYY-MM-DD',
    fieldTimeFormat: fieldTimeFormat || timeFormat,
    fieldMonthFormat: fieldMonthFormat || 'YYYY-MM',
    fieldYearFormat: fieldYearFormat || 'YYYY',
    fieldWeekFormat: fieldWeekFormat || 'gggg-wo',
    fieldQuarterFormat: fieldQuarterFormat || 'YYYY-[Q]Q',

    yearFormat: yearFormat || 'YYYY',

    cellYearFormat: cellYearFormat || 'YYYY',
    cellQuarterFormat: cellQuarterFormat || '[Q]Q',
    cellDateFormat: cellDateFormat || dayFormat || 'D',
  };
}

/**
 * Fill locale format as start up
 */
export default function useLocale<DateType extends object>(
  locale: Locale,
  showProps: Pick<
    SharedTimeProps<DateType>,
    'showHour' | 'showMinute' | 'showSecond' | 'showMillisecond' | 'use12Hours'
  >,
) {
  const { showHour, showMinute, showSecond, showMillisecond, use12Hours } = showProps;
  return React.useMemo<Locale>(
    () => fillLocale(locale, showHour, showMinute, showSecond, showMillisecond, use12Hours),
    [locale, showHour, showMinute, showSecond, showMillisecond, use12Hours],
  );
}
