'use client';

import type { ReactNode } from 'react';

import type { SearchFieldSchema } from '../hooks/useSearchForm';
import type { ProTableLocaleResolved } from '../locale';
import { partClass } from '../style';
import type { ProTableFormInstance, ProTableProps } from '../type';
import SearchForm from './SearchForm';

interface SearchSectionProps<T> {
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  loading: boolean;
  locale: ProTableLocaleResolved;
  onReset: () => void;
  props: ProTableProps<T, any>;
}

const SearchSection = <T,>({
  fields,
  form,
  loading,
  locale,
  onReset,
  props,
}: SearchSectionProps<T>): ReactNode => {
  const { cardBordered, form: formConfig, search, searchFormRender } = props;
  const formDom = (
    <div className={partClass(cardBordered, 'search')}>
      <SearchForm
        config={search || {}}
        fields={fields}
        form={form}
        ignoreRules={formConfig?.ignoreRules}
        layout={formConfig?.layout}
        loading={loading}
        locale={{
          collapse: locale.collapse,
          expand: locale.expand,
          inputPlaceholder: locale.searchPlaceholder,
          reset: locale.reset,
          search: locale.search,
          selectPlaceholder: locale.selectPlaceholder,
        }}
        onReset={onReset}
      />
    </div>
  );
  return searchFormRender ? searchFormRender(props, formDom) : formDom;
};

export default SearchSection;
