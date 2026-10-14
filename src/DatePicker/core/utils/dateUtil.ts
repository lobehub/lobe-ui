import type { GenerateConfig } from '../generate';
import type { CustomFormat, InternalMode, Locale, NullableDateType } from '../interface';

export const WEEK_DAY_COUNT = 7;

/**
 * Wrap the compare logic.
 * This will compare the each of value is empty first.
 * 1. All is empty, return true.
 * 2. One is empty, return false.
 * 3. return customize compare logic.
 */
function nullableCompare<T>(value1: T, value2: T, oriCompareFn: () => boolean): boolean {
  if ((!value1 && !value2) || value1 === value2) {
    return true;
  }
  if (!value1 || !value2) {
    return false;
  }

  return oriCompareFn();
}

export function isSameDecade<DateType>(
  generateConfig: GenerateConfig<DateType>,
  decade1: NullableDateType<DateType>,
  decade2: NullableDateType<DateType>,
) {
  return nullableCompare(decade1, decade2, () => {
    const num1 = Math.floor(generateConfig.getYear(decade1!) / 10);
    const num2 = Math.floor(generateConfig.getYear(decade2!) / 10);
    return num1 === num2;
  });
}

export function isSameYear<DateType>(
  generateConfig: GenerateConfig<DateType>,
  year1: NullableDateType<DateType>,
  year2: NullableDateType<DateType>,
) {
  return nullableCompare(
    year1,
    year2,
    () => generateConfig.getYear(year1!) === generateConfig.getYear(year2!),
  );
}

export function getQuarter<DateType>(generateConfig: GenerateConfig<DateType>, date: DateType) {
  const quota = Math.floor(generateConfig.getMonth(date) / 3);
  return quota + 1;
}

export function isSameQuarter<DateType>(
  generateConfig: GenerateConfig<DateType>,
  quarter1: NullableDateType<DateType>,
  quarter2: NullableDateType<DateType>,
) {
  return nullableCompare(
    quarter1,
    quarter2,
    () =>
      isSameYear(generateConfig, quarter1, quarter2) &&
      getQuarter(generateConfig, quarter1!) === getQuarter(generateConfig, quarter2!),
  );
}

export function isSameMonth<DateType>(
  generateConfig: GenerateConfig<DateType>,
  month1: NullableDateType<DateType>,
  month2: NullableDateType<DateType>,
) {
  return nullableCompare(
    month1,
    month2,
    () =>
      isSameYear(generateConfig, month1, month2) &&
      generateConfig.getMonth(month1!) === generateConfig.getMonth(month2!),
  );
}

export function isSameDate<DateType>(
  generateConfig: GenerateConfig<DateType>,
  date1: NullableDateType<DateType>,
  date2: NullableDateType<DateType>,
) {
  return nullableCompare(
    date1,
    date2,
    () =>
      isSameYear(generateConfig, date1, date2) &&
      isSameMonth(generateConfig, date1, date2) &&
      generateConfig.getDate(date1!) === generateConfig.getDate(date2!),
  );
}

export function isSameTime<DateType>(
  generateConfig: GenerateConfig<DateType>,
  time1: NullableDateType<DateType>,
  time2: NullableDateType<DateType>,
) {
  return nullableCompare(
    time1,
    time2,
    () =>
      generateConfig.getHour(time1!) === generateConfig.getHour(time2!) &&
      generateConfig.getMinute(time1!) === generateConfig.getMinute(time2!) &&
      generateConfig.getSecond(time1!) === generateConfig.getSecond(time2!),
  );
}

/**
 * Check if the Date is all the same of timestamp
 */
export function isSameTimestamp<DateType>(
  generateConfig: GenerateConfig<DateType>,
  time1: NullableDateType<DateType>,
  time2: NullableDateType<DateType>,
) {
  return nullableCompare(
    time1,
    time2,
    () =>
      isSameDate(generateConfig, time1, time2) &&
      isSameTime(generateConfig, time1, time2) &&
      generateConfig.getMillisecond(time1!) === generateConfig.getMillisecond(time2!),
  );
}

export function isSameWeek<DateType>(
  generateConfig: GenerateConfig<DateType>,
  locale: string,
  date1: NullableDateType<DateType>,
  date2: NullableDateType<DateType>,
) {
  return nullableCompare(date1, date2, () => {
    const weekStartDate1 = generateConfig.locale.getWeekFirstDate(locale, date1!);
    const weekStartDate2 = generateConfig.locale.getWeekFirstDate(locale, date2!);

    return (
      isSameYear(generateConfig, weekStartDate1, weekStartDate2) &&
      generateConfig.locale.getWeek(locale, date1!) ===
        generateConfig.locale.getWeek(locale, date2!)
    );
  });
}

export function isSame<DateType = any>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  source: NullableDateType<DateType>,
  target: NullableDateType<DateType>,
  type: InternalMode,
) {
  switch (type) {
    case 'date': {
      return isSameDate(generateConfig, source, target);
    }

    case 'week': {
      return isSameWeek(generateConfig, locale.locale, source, target);
    }

    case 'month': {
      return isSameMonth(generateConfig, source, target);
    }

    case 'quarter': {
      return isSameQuarter(generateConfig, source, target);
    }

    case 'year': {
      return isSameYear(generateConfig, source, target);
    }

    case 'decade': {
      return isSameDecade(generateConfig, source, target);
    }

    case 'time': {
      return isSameTime(generateConfig, source, target);
    }

    default: {
      return isSameTimestamp(generateConfig, source, target);
    }
  }
}

/** Between in date but not equal of date */
export function isInRange<DateType>(
  generateConfig: GenerateConfig<DateType>,
  startDate: NullableDateType<DateType>,
  endDate: NullableDateType<DateType>,
  current: NullableDateType<DateType>,
) {
  if (!startDate || !endDate || !current) {
    return false;
  }

  return generateConfig.isAfter(current, startDate) && generateConfig.isAfter(endDate, current);
}

export function isSameOrAfter<DateType>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  date1: NullableDateType<DateType>,
  date2: NullableDateType<DateType>,
  type: InternalMode,
) {
  if (isSame(generateConfig, locale, date1, date2, type)) {
    return true;
  }

  return generateConfig.isAfter(date1!, date2!);
}

export function getWeekStartDate<DateType>(
  locale: string,
  generateConfig: GenerateConfig<DateType>,
  value: DateType,
) {
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale);
  const monthStartDate = generateConfig.setDate(value, 1);
  const startDateWeekDay = generateConfig.getWeekDay(monthStartDate);

  let alignStartDate = generateConfig.addDate(monthStartDate, weekFirstDay - startDateWeekDay);

  if (
    generateConfig.getMonth(alignStartDate) === generateConfig.getMonth(value) &&
    generateConfig.getDate(alignStartDate) > 1
  ) {
    alignStartDate = generateConfig.addDate(alignStartDate, -7);
  }

  return alignStartDate;
}

export function formatValue<DateType>(
  value: NullableDateType<DateType>,
  {
    generateConfig,
    locale,
    format,
  }: {
    generateConfig: GenerateConfig<DateType>;
    locale: Locale;
    format: string | CustomFormat<DateType>;
  },
) {
  if (!value) {
    return '';
  }

  return typeof format === 'function'
    ? format(value)
    : generateConfig.locale.format(locale.locale, value, format);
}

/**
 * Fill the time info into Date if provided.
 */
export function fillTime<DateType>(
  generateConfig: GenerateConfig<DateType>,
  date: DateType,
  time?: NullableDateType<DateType>,
) {
  let tmpDate = date;

  const getFn = ['getHour', 'getMinute', 'getSecond', 'getMillisecond'] as const;
  const setFn = ['setHour', 'setMinute', 'setSecond', 'setMillisecond'] as const;

  setFn.forEach((fn, index) => {
    if (time) {
      tmpDate = generateConfig[fn](tmpDate, generateConfig[getFn[index]](time));
    } else {
      tmpDate = generateConfig[fn](tmpDate, 0);
    }
  });

  return tmpDate;
}
