import { useMemo } from 'react';

import tableMessages from '@/i18n/resources/en/table';
import { useTranslation } from '@/i18n/useTranslation';

import type { TableLocale } from '../type';

export const useTableLocale = (locale: TableLocale | undefined) => {
  const { t } = useTranslation(tableMessages);
  return useMemo(
    (): TableLocale => ({
      cancelSort: t('table.cancelSort'),
      collapse: t('table.collapse'),
      expand: t('table.expand'),
      filterCheckAll: t('table.filterCheckAll'),
      filterConfirm: t('table.filterConfirm'),
      filterEmptyText: t('table.filterEmptyText'),
      filterReset: t('table.filterReset'),
      filterSearchPlaceholder: t('table.filterSearchPlaceholder'),
      filterTitle: t('table.filterTitle'),
      selectAll: t('table.selectAll'),
      selectInvert: t('table.selectInvert'),
      selectNone: t('table.selectNone'),
      selectionAll: t('table.selectionAll'),
      sortTitle: t('table.sortTitle'),
      triggerAsc: t('table.triggerAsc'),
      triggerDesc: t('table.triggerDesc'),
      ...locale,
    }),
    [t, locale],
  );
};
