import type { GenerateConfig } from '../../generate';
import { useEvent } from '../../hooks/react';
import type { DisabledDate, InternalMode, Locale } from '../../interface';
import { isSame } from '../../utils/dateUtil';

export type IsInvalidBoundary<DateType> = (
  currentDate: DateType,
  type: InternalMode,
  fromDate?: DateType,
) => boolean;

/**
 * Merge `disabledDate` with `minDate` & `maxDate`.
 */
export default function useDisabledBoundary<DateType extends object = any>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  disabledDate?: DisabledDate<DateType>,
  minDate?: DateType,
  maxDate?: DateType,
) {
  const mergedDisabledDate = useEvent<DisabledDate<DateType>>((date, info) => {
    if (disabledDate && disabledDate(date, info)) {
      return true;
    }

    if (
      minDate &&
      generateConfig.isAfter(minDate, date) &&
      !isSame(generateConfig, locale, minDate, date, info.type)
    ) {
      return true;
    }

    if (
      maxDate &&
      generateConfig.isAfter(date, maxDate) &&
      !isSame(generateConfig, locale, maxDate, date, info.type)
    ) {
      return true;
    }

    return false;
  });

  return mergedDisabledDate;
}
