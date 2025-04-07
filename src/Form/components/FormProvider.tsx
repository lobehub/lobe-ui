'use client';

import type { FormProps } from 'antd';
import { ReactNode, createContext, memo, useContext } from 'react';

interface FormContentConfig {
  form?: FormProps['form'];
  initialValues?: FormProps['initialValues'];
  submitLoading?: boolean;
}

export const FormContext = createContext<FormContentConfig>({});

export const FormProvider = memo<{ children: ReactNode; config: FormContentConfig }>(
  ({ children, config }) => {
    return <FormContext.Provider value={config}>{children}</FormContext.Provider>;
  },
);

export const useFormContext = () => {
  return useContext(FormContext);
};
