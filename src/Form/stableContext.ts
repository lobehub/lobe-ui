import { createContext, use } from 'react';

import { formClasses, type formSharedElements } from './stable';

type FormClasses = (element?: (typeof formSharedElements)[number]) => string;

export const FormClassesContext = createContext<FormClasses>(formClasses);

export const useFormClasses = () => use(FormClassesContext);
