import { useMemo } from 'react';

import { useI18n } from '@/ConfigProvider';
import type { TableLocale } from '@/Table/type';

import { PRO_TABLE_LOCALE_EN_US, resolveProTableLocale } from '../locale';
import type { ProTableProps } from '../type';

export const useProLocale = (localeProp: ProTableProps['locale']) => {
  const i18n = useI18n();
  const locale = useMemo(
    () => ({ ...resolveProTableLocale(i18n?.locale), ...localeProp }),
    [i18n?.locale, localeProp],
  );
  const tableLocale = useMemo(() => {
    if (!localeProp) return undefined;
    const entries = Object.entries(localeProp).filter(([key]) => !(key in PRO_TABLE_LOCALE_EN_US));
    return entries.length > 0 ? (Object.fromEntries(entries) as TableLocale) : undefined;
  }, [localeProp]);
  return { locale, tableLocale };
};
