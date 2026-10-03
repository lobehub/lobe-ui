import type { ReactElement } from 'react';

import type { FieldBinding } from './type';

const isEventLike = (arg: unknown): arg is { target: HTMLInputElement } =>
  typeof arg === 'object' &&
  arg !== null &&
  'target' in arg &&
  typeof (arg as { target: unknown }).target === 'object' &&
  (arg as { target: unknown }).target !== null;

export const defaultGetValue = (arg: unknown) => {
  if (!isEventLike(arg)) return arg;
  const { target } = arg;
  return target.type === 'checkbox' || target.type === 'radio' ? target.checked : target.value;
};

export interface ResolvedBinding {
  getValue: (...args: any[]) => unknown;
  trigger: string;
  valueProp: string;
}

export const resolveBinding = (child: ReactElement, override: FieldBinding): ResolvedBinding => {
  const { type } = child;
  const declared =
    typeof type === 'object' || typeof type === 'function'
      ? (type as { formBinding?: FieldBinding }).formBinding
      : undefined;
  const props = child.props as { type?: string };
  const nativeCheckable = type === 'input' && (props.type === 'checkbox' || props.type === 'radio');

  return {
    getValue: override.getValue ?? declared?.getValue ?? defaultGetValue,
    trigger: override.trigger ?? declared?.trigger ?? 'onChange',
    valueProp: override.valueProp ?? declared?.valueProp ?? (nativeCheckable ? 'checked' : 'value'),
  };
};
