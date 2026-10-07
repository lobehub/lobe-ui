'use client';

import { getInternals } from './instance';
import type { FieldPath, FieldPathValue, FormInstance, FormValues } from './type';
import { useStoreSelector } from './useStoreSelector';

export function useWatch<T extends FormValues, P extends FieldPath<T>>(
  form: FormInstance<T>,
  name: P,
): FieldPathValue<T, P>;
export function useWatch<T extends FormValues, S>(
  form: FormInstance<T>,
  selector: (values: T) => S,
): S;
export function useWatch<T extends FormValues>(
  form: FormInstance<T>,
  nameOrSelector: string | ((values: T) => unknown),
) {
  const { engine } = getInternals(form);
  return useStoreSelector(engine, (e) =>
    typeof nameOrSelector === 'function'
      ? nameOrSelector(e.getValues() as T)
      : e.getValue(nameOrSelector),
  );
}
