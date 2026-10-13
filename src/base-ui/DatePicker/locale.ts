import type { Locale } from '@rc-component/picker/interface';
import enUS from '@rc-component/picker/locale/en_US';
import dayjs from 'dayjs';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import type { TranslationKey } from '@/i18n/types';
import { useTranslation } from '@/i18n/useTranslation';

import type { PickerMode } from './type';

export type PickerLocale = Locale;

const PLACEHOLDER_KEY: Partial<Record<PickerMode, TranslationKey>> = {
  date: 'datePicker.placeholder',
  month: 'datePicker.monthPlaceholder',
  year: 'datePicker.yearPlaceholder',
};

/**
 * rc-picker's locale, with `locale` following the active dayjs locale so week start and
 * week / month names track `dayjs.locale()`, plus placeholders from `@/i18n`.
 */
export const usePickerLocale = (locale?: Partial<PickerLocale>) => {
  const { t } = useTranslation(datePickerMessages);

  return {
    locale: { ...enUS, locale: dayjs.locale(), ...locale } as PickerLocale,
    placeholder: (picker: PickerMode = 'date') =>
      t(PLACEHOLDER_KEY[picker] ?? PLACEHOLDER_KEY.date!),
    rangePlaceholder: [t('datePicker.startPlaceholder'), t('datePicker.endPlaceholder')] as [
      string,
      string,
    ],
  };
};
