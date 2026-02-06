'use client';

import { Form as AntForm, type FormInstance } from 'antd';
import { type ReactNode, type RefAttributes } from 'react';

import FormGroup from './components/FormGroup';
import FormItem from './components/FormItem';
import FormSubmitFooter from './components/FormSubmitFooter';
import FormTitle from './components/FormTitle';
import FormParent from './Form';
import { type FormProps } from './type';

interface IForm {
  (props: FormProps & RefAttributes<FormInstance>): ReactNode;
  Group: typeof FormGroup;
  Item: typeof FormItem;
  Provider: typeof AntForm.Provider;
  SubmitFooter: typeof FormSubmitFooter;
  Title: typeof FormTitle;
  useForm: typeof AntForm.useForm;
}

const Form = FormParent as unknown as IForm;

Form.Item = FormItem;
Form.Group = FormGroup;
Form.Title = FormTitle;
Form.useForm = AntForm.useForm;
Form.Provider = AntForm.Provider;
Form.SubmitFooter = FormSubmitFooter;

export default Form;
export { default as FormGroup } from './components/FormGroup';
export { default as FormItem } from './components/FormItem';
export { default as FormSubmitFooter } from './components/FormSubmitFooter';
export { default as FormTitle } from './components/FormTitle';
export type * from './type';
