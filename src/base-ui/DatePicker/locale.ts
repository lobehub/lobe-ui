import enUS from '@rc-component/picker/locale/en_US';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import zhCnDatePickerMessages from '@/i18n/resources/zhCn/datePicker';
import type { TranslationKey, TranslationResources } from '@/i18n/types';
import { useTranslation } from '@/i18n/useTranslation';

import type { PickerLocale, PickerLocaleInput, PickerMode } from './type';

type Translate = (key: TranslationKey) => string;

const englishMessages: TranslationResources = datePickerMessages;

const pair = (t: Translate, start: TranslationKey, end: TranslationKey): [string, string] => [
  t(start),
  t(end),
];

const list = (value: string) => value.split(',').map((item) => item.trim());

/**
 * Every text of antd's `locale/example.json` plus the input / header / cell formats.
 * `fieldTimeFormat` / `fieldDateTimeFormat` stay unset: rc-picker derives them from
 * `showTime` (`use12Hours`, `showSecond`, …). With `names`, `shortWeekDays` / `shortMonths`
 * come from i18n too; without, they follow the dayjs locale of `locale`.
 */
const buildPickerLocale = (t: Translate, locale: string, names: boolean): PickerLocale => ({
  lang: {
    ...enUS,
    ...(names && {
      shortMonths: list(t('datePicker.shortMonths')),
      shortWeekDays: list(t('datePicker.shortWeekDays')),
    }),
    backToToday: t('datePicker.backToToday'),
    cellDateFormat: t('datePicker.cellDateFormat'),
    cellQuarterFormat: t('datePicker.cellQuarterFormat'),
    cellYearFormat: t('datePicker.cellYearFormat'),
    clear: t('datePicker.clear'),
    dateSelect: t('datePicker.dateSelect'),
    decadeSelect: t('datePicker.decadeSelect'),
    fieldDateFormat: t('datePicker.fieldDateFormat'),
    fieldMonthFormat: t('datePicker.fieldMonthFormat'),
    fieldQuarterFormat: t('datePicker.fieldQuarterFormat'),
    fieldWeekFormat: t('datePicker.fieldWeekFormat'),
    fieldYearFormat: t('datePicker.fieldYearFormat'),
    locale,
    month: t('datePicker.month'),
    monthBeforeYear: t('datePicker.monthBeforeYear') !== 'false',
    monthPlaceholder: t('datePicker.monthPlaceholder'),
    monthSelect: t('datePicker.monthSelect'),
    nextCentury: t('datePicker.nextCentury'),
    nextDecade: t('datePicker.nextDecade'),
    nextMonth: t('datePicker.nextMonth'),
    nextYear: t('datePicker.nextYear'),
    now: t('datePicker.now'),
    ok: t('datePicker.ok'),
    placeholder: t('datePicker.placeholder'),
    previousCentury: t('datePicker.previousCentury'),
    previousDecade: t('datePicker.previousDecade'),
    previousMonth: t('datePicker.previousMonth'),
    previousYear: t('datePicker.previousYear'),
    quarterPlaceholder: t('datePicker.quarterPlaceholder'),
    rangeMonthPlaceholder: pair(
      t,
      'datePicker.rangeMonthPlaceholder.start',
      'datePicker.rangeMonthPlaceholder.end',
    ),
    rangePlaceholder: pair(t, 'datePicker.startPlaceholder', 'datePicker.endPlaceholder'),
    rangeQuarterPlaceholder: pair(
      t,
      'datePicker.rangeQuarterPlaceholder.start',
      'datePicker.rangeQuarterPlaceholder.end',
    ),
    rangeWeekPlaceholder: pair(
      t,
      'datePicker.rangeWeekPlaceholder.start',
      'datePicker.rangeWeekPlaceholder.end',
    ),
    rangeYearPlaceholder: pair(
      t,
      'datePicker.rangeYearPlaceholder.start',
      'datePicker.rangeYearPlaceholder.end',
    ),
    timeSelect: t('datePicker.timeSelect'),
    today: t('datePicker.today'),
    week: t('datePicker.week'),
    weekPlaceholder: t('datePicker.weekPlaceholder'),
    weekSelect: t('datePicker.weekSelect'),
    year: t('datePicker.year'),
    yearFormat: t('datePicker.yearFormat'),
    yearPlaceholder: t('datePicker.yearPlaceholder'),
    yearSelect: t('datePicker.yearSelect'),
  },
  timePickerLocale: {
    placeholder: t('datePicker.timePlaceholder'),
    rangePlaceholder: pair(
      t,
      'datePicker.rangeTimePlaceholder.start',
      'datePicker.rangeTimePlaceholder.end',
    ),
  },
});

/**
 * Builds a complete `PickerLocale` (incl. `shortWeekDays` / `shortMonths`) from
 * `@lobehub/ui/i18n` `datePicker.*` resources; missing keys fall back to English. `locale` is
 * the rc-picker locale code (`en_US`, `zh_CN`, …) that picks the dayjs locale for week start.
 */
export const createPickerLocale = (
  resources: TranslationResources,
  locale: string = 'en_US',
): PickerLocale =>
  buildPickerLocale((key) => resources[key] || englishMessages[key] || key, locale, true);

/** Default English locale, the counterpart of antd's `date-picker/locale/en_US`. */
export const datePickerLocaleEnUS: PickerLocale = createPickerLocale(datePickerMessages, 'en_US');

/** Default Simplified Chinese locale, the counterpart of antd's `date-picker/locale/zh_CN`. */
export const datePickerLocaleZhCN: PickerLocale = createPickerLocale(
  zhCnDatePickerMessages,
  'zh_CN',
);

/** `lang` and `timePickerLocale` are merged field by field, so a partial override is enough. */
export const mergePickerLocale = (
  base: PickerLocale,
  override?: PickerLocaleInput,
): PickerLocale =>
  override
    ? {
        ...base,
        ...override,
        lang: { ...base.lang, ...override.lang },
        timePickerLocale: { ...base.timePickerLocale, ...override.timePickerLocale },
      }
    : base;

/** antd's `getPlaceholder`: one default per `picker`. */
const getPlaceholder = ({ lang, timePickerLocale }: PickerLocale, picker: PickerMode = 'date') => {
  if (picker === 'year' && lang.yearPlaceholder) return lang.yearPlaceholder;
  if (picker === 'quarter' && lang.quarterPlaceholder) return lang.quarterPlaceholder;
  if (picker === 'month' && lang.monthPlaceholder) return lang.monthPlaceholder;
  if (picker === 'week' && lang.weekPlaceholder) return lang.weekPlaceholder;
  if (picker === 'time' && timePickerLocale.placeholder) return timePickerLocale.placeholder;
  return lang.placeholder;
};

/** antd's `getRangePlaceholder`: a `[start, end]` pair per `picker`. */
const getRangePlaceholder = (
  { lang, timePickerLocale }: PickerLocale,
  picker: PickerMode = 'date',
) => {
  if (picker === 'year' && lang.rangeYearPlaceholder) return lang.rangeYearPlaceholder;
  if (picker === 'quarter' && lang.rangeQuarterPlaceholder) return lang.rangeQuarterPlaceholder;
  if (picker === 'month' && lang.rangeMonthPlaceholder) return lang.rangeMonthPlaceholder;
  if (picker === 'week' && lang.rangeWeekPlaceholder) return lang.rangeWeekPlaceholder;
  if (picker === 'time' && timePickerLocale.rangePlaceholder) {
    return timePickerLocale.rangePlaceholder;
  }
  return lang.rangePlaceholder;
};

/**
 * The default locale comes from the `@/i18n` resources in context, with `lang.locale`
 * following the active dayjs locale so week start and week / month names track
 * `dayjs.locale()` as in antd; the `locale` prop is merged over it.
 */
export const usePickerLocale = (override?: PickerLocaleInput) => {
  const { t } = useTranslation(datePickerMessages);
  const dayjsLocale = dayjs.locale();

  const locale = useMemo(
    () => mergePickerLocale(buildPickerLocale(t, dayjsLocale, false), override),
    [t, dayjsLocale, override],
  );

  return {
    locale,
    placeholder: (picker?: PickerMode) => getPlaceholder(locale, picker),
    rangePlaceholder: (picker?: PickerMode) => getRangePlaceholder(locale, picker),
  };
};
