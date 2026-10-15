import type { CSSProperties, FormHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

import type { FormLayout, FormVariant } from '../Form/type';
import type { ValidateOn } from './engine/types';
import type { FieldValidate, StandardSchema } from './schema';

type Depth = [never, 0, 1, 2, 3, 4, 5];

type IsAny<T> = 0 extends 1 & T ? true : false;

export type FieldPath<T, D extends number = 6> = [D] extends [never]
  ? string
  : IsAny<T> extends true
    ? string
    : T extends readonly (infer U)[]
      ? `${number}` | `${number}.${FieldPath<U, Depth[D]>}`
      : T extends object
        ? {
            [K in keyof T & string]:
              | K
              | (NonNullable<T[K]> extends object
                  ? `${K}.${FieldPath<NonNullable<T[K]>, Depth[D]>}`
                  : never);
          }[keyof T & string]
        : never;

export type FieldPathValue<T, P extends string> =
  IsAny<T> extends true
    ? any
    : P extends `${infer K}.${infer Rest}`
      ? K extends keyof T
        ? FieldPathValue<NonNullable<T[K]>, Rest>
        : T extends readonly (infer U)[]
          ? FieldPathValue<U, Rest>
          : unknown
      : P extends keyof T
        ? T[P]
        : T extends readonly (infer U)[]
          ? U
          : unknown;

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type FormValues = Record<string, any>;

export interface SetValueOptions {
  asUser?: boolean;
}

export interface FormValidateResult<T> {
  errors: Partial<Record<FieldPath<T>, string>>;
  valid: boolean;
}

export interface FormInstance<T extends FormValues = FormValues> {
  getValue: <P extends FieldPath<T>>(name: P) => FieldPathValue<T, P>;
  getValues: () => T;
  isDirty: () => boolean;
  isTouched: (name: FieldPath<T>) => boolean;
  reset: (values?: T) => void;
  resetField: (name: FieldPath<T>) => void;
  setErrors: (errors: Partial<Record<FieldPath<T>, string | undefined>>) => void;
  setSchema: (schema: StandardSchema | undefined) => void;
  setValue: <P extends FieldPath<T>>(
    name: P,
    value: FieldPathValue<T, P>,
    options?: SetValueOptions,
  ) => void;
  setValues: (values: DeepPartial<T>, options?: SetValueOptions) => void;
  submit: () => Promise<FormValidateResult<T>>;
  subscribe: <S>(selector: (values: T) => S, callback: (selected: S) => void) => () => void;
  validate: (names?: FieldPath<T>[]) => Promise<FormValidateResult<T>>;
}

export interface UseFormOptions<T extends FormValues> {
  initialValues?: T;
  onSubmit?: (values: T) => unknown;
  onValuesChange?: (changed: DeepPartial<T>, values: T) => void;
  schema?: StandardSchema;
  validateOn?: ValidateOn;
  values?: T;
  valuesChangeDebounce?: number;
}

export interface FieldBinding {
  emptyValue?: unknown;
  getValue?: (...args: any[]) => unknown;
  trigger?: string;
  valueProp?: string;
}

export interface FieldRenderProps<V = any> {
  error: string | undefined;
  name: string;
  onBlur: () => void;
  onChange: (value: V) => void;
  touched: boolean;
  validating: boolean;
  value: V;
}

export type { FieldValidate, StandardSchema };

export interface FormGroupItem<T extends FormValues = FormValues> {
  children: FormFieldProps<T>[] | ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  desc?: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key?: string;
  title: ReactNode;
  variant?: FormVariant;
}

export interface FormProps<T extends FormValues = FormValues> extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'className' | 'onSubmit' | 'style'
> {
  activeKey?: (string | number)[];
  children?: ReactNode;
  className?: string;
  classNames?: { group?: string; item?: string };
  collapsible?: boolean;
  defaultActiveKey?: (string | number)[];
  footer?: ReactNode;
  form: FormInstance<T>;
  gap?: number | string;
  itemMinWidth?: string | number;
  items?: FormGroupItem<T>[] | FormFieldProps<T>[];
  itemsType?: 'group' | 'flat';
  layout?: FormLayout;
  onCollapse?: (keys: (string | number)[]) => void;
  ref?: Ref<HTMLFormElement>;
  style?: CSSProperties;
  styles?: { group?: CSSProperties; item?: CSSProperties };
  variant?: FormVariant;
}

export interface FormFieldProps<T extends FormValues = FormValues> extends FieldBinding {
  avatar?: ReactNode;
  bare?: boolean;
  children?: ReactElement | ReactNode;
  className?: string;
  deps?: FieldPath<T>[];
  desc?: ReactNode;
  divider?: boolean;
  extra?: ReactNode;
  hidden?: boolean;
  label?: ReactNode;
  layout?: FormLayout;
  minWidth?: string | number;
  name?: FieldPath<T>;
  render?: (field: FieldRenderProps) => ReactNode;
  required?: boolean | string;
  style?: CSSProperties;
  tag?: string;
  validate?: FieldValidate;
  validateDebounce?: number;
  validateOn?: ValidateOn;
  variant?: FormVariant;
}
