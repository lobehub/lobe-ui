import { FormApi } from '@tanstack/form-core';

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

interface FieldRuntime {
  registration: FieldRegistration;
  timer?: ReturnType<typeof setTimeout>;
  token: number;
}

export const createTanstackEngine: CreateEngine = (initialValues) => {
  const form = new FormApi({ defaultValues: initialValues });
  const unmount = form.mount();

  const fields = new Map<string, FieldRuntime>();
  const fieldErrors = new Map<string, string>();
  const formErrors = new Map<string, string>();
  const serverErrors = new Map<string, string>();
  const validating = new Set<string>();
  const blurred = new Set<string>();
  const listeners = new Set<() => void>();
  const valueListeners = new Set<(change: ValueChange) => void>();
  const snapshots = new Map<string, FieldSnapshot>();

  let formValidator: FormValidator | undefined;
  let submitting = false;
  let submitCount = 0;
  let status: FormStatus = { dirty: false, submitCount: 0, submitting: false };

  const notify = () => {
    for (const listener of listeners) listener();
  };
  const storeSubscription = form.store.subscribe(notify);

  const getValue = (path: string) => form.getFieldValue(toEnginePath(path) as never) as unknown;
  const getValues = () => form.state.values as Record<string, unknown>;
  const isTouched = (path: string) =>
    blurred.has(path) || Boolean(form.getFieldMeta(toEnginePath(path) as never)?.isTouched);
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
    const dirty = Boolean(form.state.isDirty);
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

  const emitValueChange = (path: string, source: ChangeSource) => {
    for (const listener of valueListeners) listener({ path, source });
  };

  const afterUserChange = (path: string) => {
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
    blurred.clear();
  };

  const engine: FormEngine = {
    blurField: (path) => {
      blurred.add(path);
      schedule(path, 'blur');
      notify();
    },
    destroy: () => {
      for (const runtime of fields.values()) clearTimeout(runtime.timer);
      storeSubscription.unsubscribe();
      unmount();
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
      emitValueChange(path, 'user');
      notify();
    },
    onValueChange: (listener) => {
      valueListeners.add(listener);
      return () => valueListeners.delete(listener);
    },
    pushItem: (path, item) => {
      form.pushFieldValue(toEnginePath(path) as never, item as never);
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
      emitValueChange(path, 'user');
      notify();
    },
    reset: (values) => {
      clearRuntimeState();
      if (values) form.reset(values);
      else form.reset();
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
      form.setFieldValue(
        toEnginePath(path) as never,
        value as never,
        source === 'api' ? { dontUpdateMeta: true } : undefined,
      );
      emitValueChange(path, source);
      if (source === 'user') afterUserChange(path);
    },
    submit: async (onSubmit) => {
      submitCount += 1;
      for (const path of fields.keys()) blurred.add(path);
      const result = await validate();
      if (!result.valid) {
        notify();
        return result;
      }
      submitting = true;
      notify();
      try {
        await onSubmit?.(getValues());
        const values = getValues();
        clearRuntimeState();
        form.reset(values);
      } finally {
        submitting = false;
        notify();
      }
      return result;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    validate,
  };

  return engine;
};
