export type ChangeSource = 'user' | 'api';

export type ValidateTrigger = 'change' | 'blur' | 'submit';

export type ValidateOn = 'auto' | ValidateTrigger;

export type FieldValidator = (
  value: unknown,
  values: Record<string, unknown>,
) => string | undefined | Promise<string | undefined>;

export interface FieldRegistration {
  debounceMs?: number;
  deps?: string[];
  validate?: FieldValidator;
  validateOn?: ValidateOn;
}

export interface FieldSnapshot {
  error: string | undefined;
  touched: boolean;
  validating: boolean;
  value: unknown;
}

export interface FormStatus {
  dirty: boolean;
  submitCount: number;
  submitting: boolean;
}

export type FormValidator = (
  values: Record<string, unknown>,
) => Record<string, string> | undefined | Promise<Record<string, string> | undefined>;

export interface ValueChange {
  path: string;
  source: ChangeSource;
}

export interface ValidateResult {
  errors: Record<string, string>;
  valid: boolean;
}

export interface FormEngine {
  blurField: (path: string) => void;
  destroy: () => void;
  getField: (path: string) => FieldSnapshot;
  getStatus: () => FormStatus;
  getValue: (path: string) => unknown;
  getValues: () => Record<string, unknown>;
  isTouched: (path: string) => boolean;
  moveItem: (path: string, from: number, to: number) => void;
  onValueChange: (listener: (change: ValueChange) => void) => () => void;
  pushItem: (path: string, item: unknown) => void;
  registerField: (path: string, registration: FieldRegistration) => () => void;
  removeItem: (path: string, index: number) => void;
  reset: (values?: Record<string, unknown>) => void;
  resetField: (path: string) => void;
  setErrors: (errors: Record<string, string | undefined>) => void;
  setFormValidator: (validator: FormValidator | undefined) => void;
  setValue: (path: string, value: unknown, source: ChangeSource) => void;
  submit: (onSubmit?: (values: Record<string, unknown>) => unknown) => Promise<ValidateResult>;
  subscribe: (listener: () => void) => () => void;
  validate: (paths?: string[]) => Promise<ValidateResult>;
}

export type CreateEngine = (initialValues: Record<string, unknown>) => FormEngine;
