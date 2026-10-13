import { useMemo, useRef } from 'react';

import type { ValidateOn } from '@/base-ui/FormKit/engine/types';
import type { FieldValidate } from '@/base-ui/FormKit/type';
import { useForm } from '@/base-ui/FormKit/useForm';

import type { ProColumnType, ProTableFormInstance, ProTableFormRule } from './type';
import {
  type DateFormatter,
  formatDateValue,
  getByPath,
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

const ruleLength = (value: unknown) =>
  typeof value === 'string' || Array.isArray(value) ? value.length : Number(value);

/**
 * antd-style `rules` → the base-ui Form field props: the first `required` rule becomes
 * `required` (its `message` is the text), the rest run in order through one `validate`.
 */
export const rulesToFieldProps = (
  rules: ProTableFormRule[] | undefined,
  required?: boolean,
): { required?: boolean | string; validate?: FieldValidate } => {
  const list = rules ?? [];
  const requiredRule = list.find((rule) => rule.required);
  const rest = list.filter((rule) => !rule.required || Object.keys(rule).length > 2);
  const result: { required?: boolean | string; validate?: FieldValidate } = {};
  if (requiredRule) result.required = requiredRule.message ? String(requiredRule.message) : true;
  else if (required) result.required = true;
  if (rest.length === 0) return result;
  result.validate = async (value, values) => {
    for (const rule of rest) {
      const message = rule.message ? String(rule.message) : undefined;
      if (rule.validator) {
        try {
          await rule.validator(rule, value, values);
        } catch (error) {
          return (
            (error instanceof Error ? error.message : String(error ?? '')) ||
            message ||
            'Invalid value'
          );
        }
        continue;
      }
      if (isEmptyValue(value)) continue;
      if (rule.pattern && !rule.pattern.test(String(value))) return message ?? 'Invalid format';
      if (rule.len !== undefined && ruleLength(value) !== rule.len)
        return message ?? `Must be ${rule.len}`;
      if (rule.min !== undefined && ruleLength(value) < rule.min)
        return message ?? `At least ${rule.min}`;
      if (rule.max !== undefined && ruleLength(value) > rule.max)
        return message ?? `At most ${rule.max}`;
    }
    return undefined;
  };
  return result;
};

export interface UseSearchFormOptions {
  dateFormatter: DateFormatter;
  fields: SearchFieldSchema[];
  initialValues?: Record<string, any>;
  onSubmit: (formatted: Record<string, any>) => void;
  onValuesChange?: (changed: Record<string, any>, all: Record<string, any>) => void;
  validateOn?: ValidateOn;
}

/**
 * The search form instance: a base-ui `useForm` instance (validation, `reset`, `subscribe` …)
 * with the antd-style aliases ProTable users expect (`getFieldsValue`, `setFieldsValue`,
 * `resetFields`, `validateFields`, `getFieldsFormatValue`).
 */
export const useSearchForm = ({
  dateFormatter,
  fields,
  initialValues,
  onSubmit,
  onValuesChange,
  validateOn,
}: UseSearchFormOptions) => {
  const latest = useRef({ dateFormatter, fields, onSubmit });
  latest.current = { dateFormatter, fields, onSubmit };

  const [initial] = useMemo(() => {
    const values: Record<string, any> = {};
    fields.forEach(({ column, name }) => {
      if (column.initialValue !== undefined) setByPath(values, name, column.initialValue);
    });
    return [{ ...values, ...initialValues }];
    // Initial values are read once, like antd / Pro.
  }, []);

  const format = (raw: Record<string, any>) => {
    const { dateFormatter: formatter, fields: list } = latest.current;
    const result: Record<string, any> = {};
    const fieldRoots = new Set(list.map((field) => field.name.split('.')[0]));
    // Values set through `formRef` without a matching field pass through untouched.
    Object.entries(raw).forEach(([key, value]) => {
      if (!fieldRoots.has(key) && !isEmptyValue(value)) result[key] = value;
    });
    list.forEach(({ column, name }) => {
      const value = getByPath(raw, name.split('.'));
      if (isEmptyValue(value)) return;
      const valueType = resolveValueType(column);
      let next =
        valueType && isDateType(valueType) ? formatDateValue(value, valueType, formatter) : value;
      const { search } = column;
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

  const base = useForm<Record<string, any>>({
    initialValues: initial,
    onSubmit: (values) => latest.current.onSubmit(format(values)),
    onValuesChange,
    validateOn,
  });

  // Aliases go onto the instance itself: base-ui `Form` looks the instance up by identity.
  const form = useMemo<ProTableFormInstance>(
    () =>
      Object.assign(base, {
        getFieldsFormatValue: () => format(base.getValues()),
        getFieldsValue: () => base.getValues(),
        getFieldValue: (name: string) => base.getValue(name),
        // base-ui `reset()` returns to the last submitted values; Pro resets to the initial ones.
        resetFields: () => base.reset(structuredClone(initial)),
        setFieldsValue: (values: Record<string, any>) => base.setValues(values),
        setFieldValue: (name: string, value: any) => base.setValue(name, value),
        validateFields: async () => {
          const result = await base.validate();
          if (!result.valid) throw result;
          return base.getValues();
        },
      }) as ProTableFormInstance,
    // `format` only reads `latest`.
    [base],
  );

  return { base, form };
};
