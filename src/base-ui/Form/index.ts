'use client';

import FormDivider from './components/FormDivider';
import FormField from './components/FormField';
import FormFlatGroup from './components/FormFlatGroup';
import FormFooter from './components/FormFooter';
import FormGroup from './components/FormGroup';
import FormSubmitFooter from './components/FormSubmitFooter';
import FormTitle from './components/FormTitle';
import FormParent from './Form';

export const Form = Object.assign(FormParent, {
  Divider: FormDivider,
  Field: FormField,
  FlatGroup: FormFlatGroup,
  Footer: FormFooter,
  Group: FormGroup,
  SubmitFooter: FormSubmitFooter,
  Title: FormTitle,
});

export { useFormContext } from './context';
export {
  FormDivider,
  FormField,
  FormFlatGroup,
  FormFooter,
  FormGroup,
  FormSubmitFooter,
  FormTitle,
};
export type {
  FormContextValue,
  FormDividerProps,
  FormFieldProps,
  FormFlatGroupProps,
  FormFooterProps,
  FormGroupItemType,
  FormGroupProps,
  FormLayout,
  FormProps,
  FormSubmitFooterProps,
  FormTitleProps,
  FormValues,
  FormVariant,
  ItemsType,
} from './type';

export default Form;
