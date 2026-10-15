'use client';

import { useEffect, useRef, useState } from 'react';

import { createFormInstance, getIn, getInternals, leafPaths, setIn } from './instance';
import type { InferSchemaInput, StandardSchema } from './schema';
import type { DeepPartial, FormInstance, FormValues, UseFormOptions } from './type';

export function useForm<S extends StandardSchema<FormValues>>(
  options: UseFormOptions<InferSchemaInput<S>> & { schema: S },
): FormInstance<InferSchemaInput<S>>;
export function useForm<T extends FormValues = FormValues>(
  options?: UseFormOptions<T>,
): FormInstance<T>;
export function useForm<T extends FormValues = FormValues>(
  options: UseFormOptions<T> = {},
): FormInstance<T> {
  const [form] = useState(() =>
    createFormInstance<T>({
      initialValues: options.initialValues ?? options.values ?? {},
      schema: options.schema,
      validateOn: options.validateOn ?? 'auto',
    }),
  );
  const latest = useRef(options);
  latest.current = options;
  getInternals(form).onSubmit = (values) => latest.current.onSubmit?.(values as T);

  useEffect(() => {
    const { engine } = getInternals(form);
    const pending = new Set<string>();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const flush = () => {
      const changed: Record<string, unknown> = {};
      for (const path of pending) setIn(changed, path, engine.getValue(path));
      pending.clear();
      latest.current.onValuesChange?.(changed as DeepPartial<T>, engine.getValues() as T);
    };

    const off = engine.onValueChange(({ path, source }) => {
      if (source !== 'user' || !latest.current.onValuesChange) return;
      pending.add(path);
      const debounce = latest.current.valuesChangeDebounce ?? 0;
      if (debounce <= 0) {
        flush();
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(flush, debounce);
    });

    return () => {
      off();
      clearTimeout(timer);
    };
  }, [form]);

  const { values } = options;
  useEffect(() => {
    if (!values) return;
    const { engine } = getInternals(form);
    for (const path of leafPaths(values)) {
      const next = getIn(values, path);
      if (!engine.isTouched(path) && !Object.is(engine.getValue(path), next))
        engine.setValue(path, next, 'api');
    }
  }, [form, values]);

  return form;
}
