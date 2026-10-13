import type { Locale } from '@rc-component/picker/interface';
import enUS from '@rc-component/picker/locale/en_US';
import dayjs from 'dayjs';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import type { TranslationKey } from '@/i18n/types';
import { useTranslation } from '@/i18n/useTranslation';

import type { PickerMode } from './type';

export type PickerLocale = Locale;

/** antd's `getPlaceholder`: one default per `picker`. */
const PLACEHOLDER_KEY: Partial<Record<PickerMode, TranslationKey>> = {
  date: 'datePicker.placeholder',
  month: 'datePicker.monthPlaceholder',
  quarter: 'datePicker.quarterPlaceholder',
  time: 'datePicker.timePlaceholder',
  week: 'datePicker.weekPlaceholder',
  year: 'datePicker.yearPlaceholder',
};

/** antd's `getRangePlaceholder`: a `[start, end]` pair per `picker`. */
const RANGE_PLACEHOLDER_KEYS: Partial<Record<PickerMode, [TranslationKey, TranslationKey]>> = {
  date: ['datePicker.startPlaceholder', 'datePicker.endPlaceholder'],
  month: ['datePicker.rangeMonthPlaceholder.start', 'datePicker.rangeMonthPlaceholder.end'],
  quarter: ['datePicker.rangeQuarterPlaceholder.start', 'datePicker.rangeQuarterPlaceholder.end'],
  time: ['datePicker.rangeTimePlaceholder.start', 'datePicker.rangeTimePlaceholder.end'],
  week: ['datePicker.rangeWeekPlaceholder.start', 'datePicker.rangeWeekPlaceholder.end'],
  year: ['datePicker.rangeYearPlaceholder.start', 'datePicker.rangeYearPlaceholder.end'],
};

/**
 * rc-picker's locale, with `locale` following the active dayjs locale so week start and
 * week / month names track `dayjs.locale()`, plus placeholders from `@/i18n`. Default
 * formats per picker (`YYYY-MM-DD`, `gggg-wo`, `YYYY-MM`, `YYYY-[Q]Q`, `YYYY`, `HH:mm:ss`) come from
 * rc-picker's locale fallbacks, as in antd.
 */
export const usePickerLocale = (locale?: Partial<PickerLocale>) => {
  const { t } = useTranslation(datePickerMessages);

  return {
    locale: { ...enUS, locale: dayjs.locale(), ...locale } as PickerLocale,
    placeholder: (picker: PickerMode = 'date') =>
      t(PLACEHOLDER_KEY[picker] ?? PLACEHOLDER_KEY.date!),
    rangePlaceholder: (picker: PickerMode = 'date') =>
      (RANGE_PLACEHOLDER_KEYS[picker] ?? RANGE_PLACEHOLDER_KEYS.date!).map((key) => t(key)) as [
        string,
        string,
      ],
  };
};
