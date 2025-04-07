'use client';

import { Form as AntForm, type FormInstance } from 'antd';
import { type ReactNode, RefAttributes } from 'react';

import FormParent from './Form';
import FormGroup from './components/FormGroup';
import FormItem from './components/FormItem';
import FormSubmitFooter from './components/FormSubmitFooter';
import type { FormProps } from './type';

export interface IForm {
  (props: FormProps & RefAttributes<FormInstance>): ReactNode;
  Group: typeof FormGroup;
  Item: typeof FormItem;
  Provider: typeof AntForm.Provider;
  SubmitFooter: typeof FormSubmitFooter;
  useForm: typeof AntForm.useForm;
}

const Form = FormParent as unknown as IForm;

Form.Item = FormItem;
Form.Group = FormGroup;
Form.useForm = AntForm.useForm;
Form.Provider = AntForm.Provider;
Form.SubmitFooter = FormSubmitFooter;

export default Form;
export {
  default as FormGroup,
  type FormGroupItem,
  type FormGroupProps,
} from './components/FormGroup';
export { default as FormItem, type FormItemProps } from './components/FormItem';
export {
  default as FormSubmitFooter,
  type FormSubmitFooterProps,
} from './components/FormSubmitFooter';
export type { FormProps } from './type';
export type { FormInstance } from 'antd';
