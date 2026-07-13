'use client';

import { createContext, use } from 'react';

import type { FormContextValue } from './type';

export const FormContext = createContext<FormContextValue>({
  hasUnsavedChanges: false,
  layout: 'horizontal',
  requestReset: () => {},
  submitLoading: false,
  variant: 'borderless',
});

export const useFormContext = () => use(FormContext);
