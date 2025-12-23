import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import type { I18nContextValue, TranslationKey, TranslationResources } from './types';

export interface I18nProviderProps {
  children: ReactNode;
  locale?: string;
  resources?: TranslationResources[];
}

const defaultValue: I18nContextValue = {
  locale: 'en',
  t: (key: TranslationKey) => key,
};

const I18nContext = createContext<I18nContextValue>(defaultValue);

export const I18nProvider = ({ children, resources = [], locale = 'en' }: I18nProviderProps) => {
  const mergedResources = useMemo(() => Object.assign({}, ...resources), [resources]);

  const t = useCallback(
    (key: TranslationKey): string => mergedResources[key] || key,
    [mergedResources],
  );

  const value = useMemo(() => ({ locale, t }), [locale, t]);

  return <I18nContext value={value}>{children}</I18nContext>;
};

export const useI18n = () => useContext(I18nContext);
