'use client';

import FormDivider from '../Form/components/FormDivider';
import FormFlatGroup from '../Form/components/FormFlatGroup';
import FormFooter from '../Form/components/FormFooter';
import FormGroup from '../Form/components/FormGroup';
import FormTitle from '../Form/components/FormTitle';
import FormField from './Field';
import FormParent from './Form';
import FormList from './List';
import FormSubmitFooter from './SubmitFooter';

export const Form = Object.assign(FormParent, {
  Divider: FormDivider,
  Field: FormField,
  FlatGroup: FormFlatGroup,
  Footer: FormFooter,
  Group: FormGroup,
  List: FormList,
  SubmitFooter: FormSubmitFooter,
  Title: FormTitle,
});

export { useFormInstance } from './context';
export type { FormListColumn, FormListField, FormListProps, FormListRenderProps } from './List';
export type {
  DeepPartial,
  FieldBinding,
  FieldPath,
  FieldPathValue,
  FieldRenderProps,
  FieldValidate,
  FormFieldProps,
  FormGroupItem,
  FormInstance,
  FormProps,
  FormValidateResult,
  FormValues,
  SetValueOptions,
  StandardSchema,
  UseFormOptions,
} from './type';
export { useForm } from './useForm';
export { useWatch } from './useWatch';
export { FormField, FormList, FormSubmitFooter };

export default Form;
