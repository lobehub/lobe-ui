import { FormApi, getBy, setBy } from '@tanstack/form-core';
import isEqual from 'fast-deep-equal';

import type {
  ChangeSource,
  CreateEngine,
  FieldRegistration,
  FieldSnapshot,
  FormEngine,
  FormStatus,
  FormValidator,
  ValidateResult,
  ValidateTrigger,
  ValueChange,
} from './types';

const toEnginePath = (path: string) => path.replaceAll(/\.(\d+)(?=\.|$)/g, '[$1]');

const isSameOrNested = (a: string, b: string) =>
  a === b || a.startsWith(`${b}.`) || b.startsWith(`${a}.`);

const isUnder = (path: string, root: string) => path === root || path.startsWith(`${root}.`);

interface FieldRuntime {
  registration: FieldRegistration;
  timer?: ReturnType<typeof setTimeout>;
  token: number;
}

export const createTanstackEngine: CreateEngine = (initialValues) => {
  const form = new FormApi({ defaultValues: initialValues });

  const fields = new Map<string, FieldRuntime>();
  const fieldErrors = new Map<string, string>();
  const formErrors = new Map<string, string>();
  const serverErrors = new Map<string, string>();
  const validating = new Set<string>();
  const touched = new Set<string>();
  const listeners = new Set<() => void>();
  const valueListeners = new Set<(change: ValueChange) => void>();
  const snapshots = new Map<string, FieldSnapshot>();

  let formValidator: FormValidator | undefined;
  let baseline = initialValues;
  let dirtyCache: { baseline: unknown; dirty: boolean; values: unknown } | undefined;
  let inflightSubmit: Promise<ValidateResult> | undefined;
  let submitting = false;
  let submitCount = 0;
  let status: FormStatus = { dirty: false, submitCount: 0, submitting: false };

  const notify = () => {
    for (const listener of listeners) listener();
  };
  const storeSubscription = form.store.subscribe(notify);

  const getValue = (path: string) => form.getFieldValue(toEnginePath(path) as never) as unknown;
  const getValues = () => form.state.values as Record<string, unknown>;
  const isTouched = (path: string) => {
    for (const entry of touched) if (isSameOrNested(entry, path)) return true;
    return false;
  };
  const errorOf = (path: string) =>
    serverErrors.get(path) ?? fieldErrors.get(path) ?? formErrors.get(path);

  const getField = (path: string): FieldSnapshot => {
    const next: FieldSnapshot = {
      error: errorOf(path),
      touched: isTouched(path),
      validating: validating.has(path),
      value: getValue(path),
    };
    const prev = snapshots.get(path);
    if (
      prev &&
      prev.error === next.error &&
      prev.touched === next.touched &&
      prev.validating === next.validating &&
      Object.is(prev.value, next.value)
    )
      return prev;
    snapshots.set(path, next);
    return next;
  };

  const getStatus = (): FormStatus => {
    const values = getValues();
    if (dirtyCache?.values !== values || dirtyCache.baseline !== baseline)
      dirtyCache = { baseline, dirty: !isEqual(values, baseline), values };
    const { dirty } = dirtyCache;
    if (
      status.dirty !== dirty ||
      status.submitting !== submitting ||
      status.submitCount !== submitCount
    )
      status = { dirty, submitCount, submitting };
    return status;
  };

  const shouldValidate = (path: string, trigger: ValidateTrigger) => {
    const mode = fields.get(path)?.registration.validateOn ?? 'auto';
    if (trigger === 'submit') return true;
    if (mode === 'change') return true;
    if (mode === 'blur') return trigger === 'blur';
    if (mode === 'submit') return false;
    return trigger === 'blur' || errorOf(path) !== undefined;
  };

  const setOrDelete = (map: Map<string, string>, path: string, error: string | undefined) => {
    if (error === undefined) map.delete(path);
    else map.set(path, error);
  };

  const runField = (path: string, withFormValidator: boolean): Promise<void> => {
    const runtime = fields.get(path);
    if (!runtime) return Promise.resolve();
    runtime.token += 1;
    const token = runtime.token;
    const { validate } = runtime.registration;
    if (!validate && !(withFormValidator && formValidator)) return Promise.resolve();

    validating.add(path);
    notify();
    return (async () => {
      const values = getValues();
      const [fieldError, formResult] = await Promise.all([
        validate?.(getValue(path), values),
        withFormValidator ? formValidator?.(values) : undefined,
      ]);
      if (runtime.token !== token || fields.get(path) !== runtime) return;
      setOrDelete(fieldErrors, path, fieldError);
      if (withFormValidator) setOrDelete(formErrors, path, formResult?.[path]);
      validating.delete(path);
      notify();
    })();
  };

  const schedule = (path: string, trigger: ValidateTrigger) => {
    const runtime = fields.get(path);
    if (!runtime || !shouldValidate(path, trigger)) return;
    clearTimeout(runtime.timer);
    const debounceMs = runtime.registration.debounceMs ?? 0;
    if (trigger === 'change' && debounceMs > 0) {
      runtime.token += 1;
      runtime.timer = setTimeout(() => void runField(path, true), debounceMs);
      return;
    }
    void runField(path, true);
  };

  const clearErrorsUnder = (path: string, inclusive = false) => {
    for (const map of [fieldErrors, formErrors, serverErrors])
      for (const key of map.keys())
        if (inclusive ? isUnder(key, path) : key.startsWith(`${path}.`)) map.delete(key);
  };

  const resetTo = (values: Record<string, unknown>) => {
    clearRuntimeState();
    baseline = values;
    form.reset(values);
    notify();
  };

  const emitValueChange = (path: string, source: ChangeSource) => {
    for (const listener of valueListeners) listener({ path, source });
  };

  const afterUserChange = (path: string) => {
    touched.add(path);
    serverErrors.delete(path);
    schedule(path, 'change');
    for (const [other, runtime] of fields) {
      if (other !== path && runtime.registration.deps?.includes(path) && isTouched(other))
        void runField(other, true);
    }
    notify();
  };

  const validate = async (paths?: string[]): Promise<ValidateResult> => {
    const values = getValues();
    const formResult = (formValidator ? await formValidator(values) : undefined) ?? {};
    const targets = paths ?? [...new Set([...fields.keys(), ...Object.keys(formResult)])];
    await Promise.all(targets.map((path) => runField(path, false)));
    for (const path of targets) setOrDelete(formErrors, path, formResult[path]);
    notify();
    const errors: Record<string, string> = {};
    for (const path of targets) {
      const error = errorOf(path);
      if (error !== undefined) errors[path] = error;
    }
    return { errors, valid: Object.keys(errors).length === 0 };
  };

  const clearRuntimeState = () => {
    for (const runtime of fields.values()) {
      clearTimeout(runtime.timer);
      runtime.token += 1;
    }
    fieldErrors.clear();
    formErrors.clear();
    serverErrors.clear();
    validating.clear();
    touched.clear();
  };

  const runSubmit = async (onSubmit?: (values: Record<string, unknown>) => unknown) => {
    submitCount += 1;
    serverErrors.clear();
    for (const path of fields.keys()) touched.add(path);
    const result = await validate();
    if (!result.valid) {
      notify();
      return result;
    }
    submitting = true;
    notify();
    try {
      await onSubmit?.(getValues());
      resetTo(getValues());
    } finally {
      submitting = false;
      notify();
    }
    return result;
  };

  const engine: FormEngine = {
    blurField: (path) => {
      touched.add(path);
      schedule(path, 'blur');
      notify();
    },
    destroy: () => {
      for (const runtime of fields.values()) clearTimeout(runtime.timer);
      storeSubscription.unsubscribe();
      listeners.clear();
      valueListeners.clear();
    },
    getField,
    getStatus,
    getValue,
    getValues,
    isTouched,
    moveItem: (path, from, to) => {
      form.moveFieldValues(toEnginePath(path) as never, from, to);
      touched.add(path);
      clearErrorsUnder(path);
      emitValueChange(path, 'user');
      notify();
    },
    onValueChange: (listener) => {
      valueListeners.add(listener);
      return () => valueListeners.delete(listener);
    },
    pushItem: (path, item) => {
      form.pushFieldValue(toEnginePath(path) as never, item as never);
      touched.add(path);
      emitValueChange(path, 'user');
      notify();
    },
    registerField: (path, registration) => {
      const runtime: FieldRuntime = { registration, token: 0 };
      fields.set(path, runtime);
      return () => {
        if (fields.get(path) !== runtime) return;
        clearTimeout(runtime.timer);
        fields.delete(path);
        fieldErrors.delete(path);
        validating.delete(path);
        snapshots.delete(path);
        notify();
      };
    },
    removeItem: (path, index) => {
      void form.removeFieldValue(toEnginePath(path) as never, index);
      touched.add(path);
      clearErrorsUnder(path);
      emitValueChange(path, 'user');
      notify();
    },
    reset: (values) => resetTo(values ?? baseline),
    resetField: (path) => {
      for (const [key, runtime] of fields) {
        if (!isUnder(key, path)) continue;
        clearTimeout(runtime.timer);
        runtime.token += 1;
        validating.delete(key);
      }
      for (const entry of touched) if (isUnder(entry, path)) touched.delete(entry);
      clearErrorsUnder(path, true);
      form.setFieldValue(toEnginePath(path) as never, getBy(baseline, toEnginePath(path)), {
        dontUpdateMeta: true,
      });
      emitValueChange(path, 'api');
      notify();
    },
    setErrors: (errors) => {
      for (const [path, error] of Object.entries(errors)) setOrDelete(serverErrors, path, error);
      notify();
    },
    setFormValidator: (validator) => {
      formValidator = validator;
    },
    setValue: (path, value, source) => {
      form.setFieldValue(toEnginePath(path) as never, value as never, { dontUpdateMeta: true });
      if (source === 'api') baseline = setBy(baseline, toEnginePath(path), () => value);
      emitValueChange(path, source);
      if (source === 'user') afterUserChange(path);
    },
    submit: (onSubmit) => {
      inflightSubmit ??= runSubmit(onSubmit).finally(() => {
        inflightSubmit = undefined;
      });
      return inflightSubmit;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    validate,
  };

  return engine;
};
