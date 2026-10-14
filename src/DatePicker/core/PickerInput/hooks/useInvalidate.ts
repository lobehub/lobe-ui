import type { GenerateConfig } from '../../generate';
import { useEvent } from '../../hooks/react';
import type {
  PanelMode,
  RangeTimeProps,
  SharedPickerProps,
  SharedTimeProps,
} from '../../interface';

/**
 * Check if provided date is valid for the `disabledDate` & `showTime.disabledTime`.
 */
export default function useInvalidate<DateType extends object = any>(
  generateConfig: GenerateConfig<DateType>,
  picker: PanelMode,
  disabledDate?: SharedPickerProps<DateType>['disabledDate'],
  showTime?: SharedTimeProps<DateType> | RangeTimeProps<DateType> | null,
) {
  // Check disabled date
  const isInvalidate = useEvent(
    (date: DateType, info?: { from?: DateType; activeIndex: number }) => {
      const outsideInfo = { type: picker, ...info };
      delete outsideInfo.activeIndex;

      if (
        // Date object is invalid
        !generateConfig.isValidate(date) ||
        // Date is disabled by `disabledDate`
        (disabledDate && disabledDate(date, outsideInfo))
      ) {
        return true;
      }

      if ((picker === 'date' || picker === 'time') && showTime) {
        const range = info && info.activeIndex === 1 ? 'end' : 'start';
        const { disabledHours, disabledMinutes, disabledSeconds, disabledMilliseconds } =
          showTime.disabledTime?.(date, range, { from: outsideInfo.from }) || {};

        const {
          disabledHours: legacyDisabledHours,
          disabledMinutes: legacyDisabledMinutes,
          disabledSeconds: legacyDisabledSeconds,
        } = showTime;

        const mergedDisabledHours = disabledHours || legacyDisabledHours;
        const mergedDisabledMinutes = disabledMinutes || legacyDisabledMinutes;
        const mergedDisabledSeconds = disabledSeconds || legacyDisabledSeconds;

        const hour = generateConfig.getHour(date);
        const minute = generateConfig.getMinute(date);
        const second = generateConfig.getSecond(date);
        const millisecond = generateConfig.getMillisecond(date);

        if (mergedDisabledHours && mergedDisabledHours().includes(hour)) {
          return true;
        }

        if (mergedDisabledMinutes && mergedDisabledMinutes(hour).includes(minute)) {
          return true;
        }

        if (mergedDisabledSeconds && mergedDisabledSeconds(hour, minute).includes(second)) {
          return true;
        }

        if (
          disabledMilliseconds &&
          disabledMilliseconds(hour, minute, second).includes(millisecond)
        ) {
          return true;
        }
      }
      return false;
    },
  );

  return isInvalidate;
}
