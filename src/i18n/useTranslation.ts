import { useMemo } from 'react';

import { useI18n } from './context';
import type { TranslationKey, TranslationResources } from './types';

export const useTranslation = (fallbackResources?: TranslationResources) => {
  const { t, locale } = useI18n();

  const translate = useMemo((): ((key: TranslationKey) => string) => {
    if (!fallbackResources) return t;

    return (key: TranslationKey): string => {
      const value = t(key);
      const fallback = fallbackResources[key];
      return value === key && fallback ? fallback : value;
    };
  }, [t, fallbackResources]);

  return { locale, t: translate };
};
