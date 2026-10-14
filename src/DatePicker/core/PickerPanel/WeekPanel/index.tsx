import { clsx } from 'clsx';
import * as React from 'react';

import type { SharedPanelProps } from '../../interface';
import { isInRange, isSameWeek } from '../../utils/dateUtil';
import DatePanel from '../DatePanel';

export default function WeekPanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const { prefixCls, generateConfig, locale, value, hoverValue, hoverRangeValue } = props;

  // =============================== Row ================================
  const localeName = locale.locale;

  const rowPrefixCls = `${prefixCls}-week-panel-row`;

  const rowClassName = (currentDate: DateType) => {
    const rangeCls: Record<string, boolean> = {};

    if (hoverRangeValue) {
      const [rangeStart, rangeEnd] = hoverRangeValue;

      const isRangeStart = isSameWeek(generateConfig, localeName, rangeStart, currentDate);
      const isRangeEnd = isSameWeek(generateConfig, localeName, rangeEnd, currentDate);

      rangeCls[`${rowPrefixCls}-range-start`] = isRangeStart;
      rangeCls[`${rowPrefixCls}-range-end`] = isRangeEnd;
      rangeCls[`${rowPrefixCls}-range-hover`] =
        !isRangeStart &&
        !isRangeEnd &&
        isInRange(generateConfig, rangeStart, rangeEnd, currentDate);
    }

    if (hoverValue) {
      rangeCls[`${rowPrefixCls}-hover`] = hoverValue.some((date) =>
        isSameWeek(generateConfig, localeName, currentDate, date),
      );
    }

    return clsx(
      rowPrefixCls,
      {
        [`${rowPrefixCls}-selected`]:
          !hoverRangeValue && isSameWeek(generateConfig, localeName, value, currentDate),
      },
      // Patch for hover range
      rangeCls,
    );
  };

  // ============================== Render ==============================
  return <DatePanel {...props} mode="week" panelName="week" rowClassName={rowClassName} />;
}
