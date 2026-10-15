import type { GenerateConfig } from '../../generate';
import type { DisabledDate, Locale } from '../../interface';
import { isSame } from '../../utils/dateUtil';
import { getFromDate } from '../../utils/miscUtil';
import type { RangeValueType } from '../RangePicker';

/**
 * RangePicker need additional logic to handle the `disabled` case. e.g.
 * [disabled, enabled] should end date not before start date
 */
export default function useRangeDisabledDate<DateType extends object = any>(
  values: RangeValueType<DateType>,
  disabled: [boolean, boolean],
  activeIndex: number,
  triggeredFields: number[],
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  disabledDate?: DisabledDate<DateType>,
) {
  const rangeDisabledDate: DisabledDate<DateType> = (date, info) => {
    const [start, end] = values;

    const mergedInfo = {
      ...info,
      from: getFromDate(values, triggeredFields, activeIndex),
    };

    // ============================ Disabled ============================
    // Should not select days before the start date
    if (
      activeIndex === 1 &&
      disabled[0] &&
      start &&
      // Same date isOK
      !isSame(generateConfig, locale, start, date, mergedInfo.type) &&
      // Before start date
      generateConfig.isAfter(start, date)
    ) {
      return true;
    }

    // Should not select days after the end date
    if (
      activeIndex === 0 &&
      disabled[1] &&
      end &&
      // Same date isOK
      !isSame(generateConfig, locale, end, date, mergedInfo.type) &&
      // After end date
      generateConfig.isAfter(date, end)
    ) {
      return true;
    }

    // ============================= Origin =============================
    return !!disabledDate?.(date, mergedInfo);
  };

  return rangeDisabledDate;
}
