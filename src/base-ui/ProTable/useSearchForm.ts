import { useMemo, useRef, useState } from 'react';

import type { ProColumnType, ProTableFormInstance } from './type';
import {
  type DateFormatter,
  formatDateValue,
  getFieldName,
  isDateType,
  isEmptyValue,
  isNil,
  resolveValueType,
  setByPath,
} from './utils';

export interface SearchFieldSchema {
  column: ProColumnType<any>;
  index: number;
  name: string;
}

const NON_SEARCH_TYPES = new Set(['index', 'indexBorder', 'option']);

/** Flatten (group children included) and pick the columns that show in the search form. */
export const getSearchFields = (columns: ProColumnType<any>[] = []): SearchFieldSchema[] => {
  const list: SearchFieldSchema[] = [];
  const walk = (items: ProColumnType<any>[]) => {
    items.forEach((column) => {
      if (column.children?.length) {
        walk(column.children);
        return;
      }
      const index = list.length;
      const valueType = resolveValueType(column);
      if (column.hideInSearch || column.search === false) return;
      if (valueType && NON_SEARCH_TYPES.has(valueType)) return;
      if (isNil(column.dataIndex) && isNil(column.key) && !column.renderFormItem) return;
      list.push({ column, index, name: getFieldName(column, index) });
    });
  };
  walk(columns);
  // Pro: larger `order` first; stable for equal orders.
  return list
    .map((field, position) => ({ field, position }))
    .sort(
      (a, b) =>
        (b.field.column.order ?? 0) - (a.field.column.order ?? 0) || a.position - b.position,
    )
    .map(({ field }) => field);
};

export interface UseSearchFormOptions {
  dateFormatter: DateFormatter;
  fields: SearchFieldSchema[];
  initialValues?: Record<string, any>;
  onSubmit: (formatted: Record<string, any>) => void;
  onValuesChange?: (changed: Record<string, any>, all: Record<string, any>) => void;
}

/** Search-form state and the `formRef` handle (a small `FormInstance` subset). */
export const useSearchForm = ({
  dateFormatter,
  fields,
  initialValues,
  onSubmit,
  onValuesChange,
}: UseSearchFormOptions) => {
  const computeInitial = () => {
    const values: Record<string, any> = {};
    fields.forEach(({ column, name }) => {
      if (column.initialValue !== undefined) values[name] = column.initialValue;
    });
    return { ...values, ...initialValues };
  };

  const [values, setValues] = useState<Record<string, any>>(computeInitial);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const latest = useRef({ computeInitial, dateFormatter, fields, onSubmit, onValuesChange });
  latest.current = { computeInitial, dateFormatter, fields, onSubmit, onValuesChange };

  const update = (next: Record<string, any>, changed: Record<string, any>) => {
    valuesRef.current = next;
    setValues(next);
    latest.current.onValuesChange?.(changed, next);
  };

  const form = useMemo<ProTableFormInstance>(() => {
    const format = (raw: Record<string, any>) => {
      const { dateFormatter: formatter, fields: list } = latest.current;
      const result: Record<string, any> = {};
      const byName = new Map(list.map((field) => [field.name, field]));
      Object.entries(raw).forEach(([name, value]) => {
        if (isEmptyValue(value)) return;
        const field = byName.get(name);
        const valueType = field ? resolveValueType(field.column) : undefined;
        let next =
          valueType && isDateType(valueType) ? formatDateValue(value, valueType, formatter) : value;
        const search = field?.column.search;
        if (search && typeof search === 'object' && search.transform) {
          const transformed = search.transform(next, name, raw);
          if (transformed && typeof transformed === 'object') {
            Object.assign(result, transformed);
            return;
          }
          if (typeof transformed === 'string') {
            setByPath(result, transformed, next);
            return;
          }
          next = transformed;
        }
        setByPath(result, name, next);
      });
      return result;
    };

    return {
      getFieldValue: (name) => valuesRef.current[name],
      getFieldsFormatValue: () => format(valuesRef.current),
      getFieldsValue: () => ({ ...valuesRef.current }),
      resetFields: () => update(latest.current.computeInitial(), {}),
      setFieldValue: (name, value) =>
        update({ ...valuesRef.current, [name]: value }, { [name]: value }),
      setFieldsValue: (partial) => update({ ...valuesRef.current, ...partial }, partial),
      submit: () => latest.current.onSubmit(format(valuesRef.current)),
    };
  }, []);

  return { form, values };
};
