import { createTanstackEngine } from './engine/tanstack';
import type { FormEngine, ValidateOn } from './engine/types';
import { schemaToFormValidator } from './schema';
import type { FormInstance, FormValues } from './type';

interface InstanceInternals {
  engine: FormEngine;
  onSubmit?: (values: FormValues) => unknown;
  validateOn: ValidateOn;
}

const internals = new WeakMap<object, InstanceInternals>();

export const getInternals = (form: object): InstanceInternals => {
  const found = internals.get(form);
  if (!found) throw new Error('[@lobehub/ui/base-ui/form] form was not created by useForm');
  return found;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

export const leafPaths = (value: unknown, prefix = ''): string[] => {
  if (!isPlainObject(value) || (prefix && Object.keys(value).length === 0))
    return prefix ? [prefix] : [];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
};

export const getIn = (value: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as any)[key]), value);

export const setIn = (target: Record<string, unknown>, path: string, value: unknown) => {
  const keys = path.split('.');
  let cursor: Record<string, unknown> = target;
  keys.slice(0, -1).forEach((key) => {
    if (!isPlainObject(cursor[key])) cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  });
  cursor[keys.at(-1)!] = value;
};

interface CreateOptions {
  initialValues: FormValues;
  schema?: Parameters<typeof schemaToFormValidator>[0];
  validateOn: ValidateOn;
}

export const createFormInstance = <T extends FormValues>({
  initialValues,
  schema,
  validateOn,
}: CreateOptions): FormInstance<T> => {
  const engine = createTanstackEngine(initialValues);
  if (schema) engine.setFormValidator(schemaToFormValidator(schema));
  const source = (options?: { asUser?: boolean }) => (options?.asUser ? 'user' : 'api');

  const form: FormInstance<T> = {
    getValue: ((name: string) => engine.getValue(name)) as FormInstance<T>['getValue'],
    getValues: () => engine.getValues() as T,
    isDirty: () => engine.getStatus().dirty,
    isTouched: (name) => engine.isTouched(name),
    reset: (values) => engine.reset(values),
    resetField: (name) => engine.resetField(name),
    setErrors: (errors) => engine.setErrors(errors as Record<string, string | undefined>),
    setSchema: (next) => engine.setFormValidator(next ? schemaToFormValidator(next) : undefined),
    setValue: ((name: string, value: unknown, options?: { asUser?: boolean }) =>
      engine.setValue(name, value, source(options))) as FormInstance<T>['setValue'],
    setValues: (values, options) => {
      for (const path of leafPaths(values))
        engine.setValue(path, getIn(values, path), source(options));
    },
    submit: () =>
      engine.submit((values) => internals.get(form)?.onSubmit?.(values)) as ReturnType<
        FormInstance<T>['submit']
      >,
    subscribe: (selector, callback) => {
      let selected = selector(engine.getValues() as T);
      return engine.subscribe(() => {
        const next = selector(engine.getValues() as T);
        if (Object.is(next, selected)) return;
        selected = next;
        callback(next);
      });
    },
    validate: (names) => engine.validate(names) as ReturnType<FormInstance<T>['validate']>,
  };

  internals.set(form, { engine, validateOn });
  return form;
};
