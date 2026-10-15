'use client';

import { createContext, use } from 'react';

import type { FormLayout, FormVariant } from '../Form/type';
import type { FormInstance, FormValues } from './type';

export interface FormKitContextValue {
  form: FormInstance<any>;
  layout: FormLayout;
  variant: FormVariant;
}

export const FormKitContext = createContext<FormKitContextValue | null>(null);

export const useFormKitContext = () => {
  const value = use(FormKitContext);
  if (!value) throw new Error('[@lobehub/ui/form] Form.Field must be rendered inside <Form>');
  return value;
};

export const useFormInstance = <T extends FormValues = FormValues>() =>
  useFormKitContext().form as FormInstance<T>;
