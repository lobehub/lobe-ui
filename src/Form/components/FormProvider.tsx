'use client';

import { type FormProps } from 'antd';
import { createContext, memo, type ReactNode, use } from 'react';

interface FormContentConfig {
  form?: FormProps['form'];
  initialValues?: FormProps['initialValues'];
  submitLoading?: boolean;
}

export const FormContext = createContext<FormContentConfig>({});

export const FormProvider = memo<{ children: ReactNode; config: FormContentConfig }>(
  ({ children, config }) => {
    return <FormContext value={config}>{children}</FormContext>;
  },
);

export const useFormContext = () => {
  return use(FormContext);
};
