import { type ReactNode, memo } from 'react';

import ConfigProvider from '@/ConfigProvider';
import { type MotionComponentType } from '@/MotionProvider';

import type { TranslationResourcesInput } from './types';

export interface I18nProviderProps {
  children: ReactNode;
  locale?: string;
  motion: MotionComponentType;
  resources?: TranslationResourcesInput;
}

// Re-export for backward compatibility
export { I18nContext } from '@/ConfigProvider';

// I18nProvider delegates to ConfigProvider with flattened i18n props
export const I18nProvider = memo<I18nProviderProps>(({ children, locale, resources, motion }) => {
  return (
    <ConfigProvider config={{}} locale={locale} motion={motion} resources={resources}>
      {children}
    </ConfigProvider>
  );
});

// Internal useI18n - for useTranslation only, not exported publicly
export { useI18n } from '@/ConfigProvider';

// Re-export types
export type { I18nContextValue, TranslationKey, TranslationResources } from './types';
