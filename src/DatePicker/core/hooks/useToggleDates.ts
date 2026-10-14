import type { GenerateConfig } from '../generate';
import type { InternalMode, Locale } from '../interface';
import { isSame } from '../utils/dateUtil';

/**
 * Toggles the presence of a value in an array.
 * If the value exists in the array, removed it.
 * Else add it.
 */
export default function useToggleDates<DateType>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  panelMode: InternalMode,
) {
  function toggleDates(list: DateType[], target: DateType) {
    const index = list.findIndex((date) => isSame(generateConfig, locale, date, target, panelMode));

    if (index === -1) {
      return [...list, target];
    }

    const sliceList = [...list];
    sliceList.splice(index, 1);

    return sliceList;
  }

  return toggleDates;
}
