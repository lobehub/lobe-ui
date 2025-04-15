import type { Ref } from 'react';

import type { ButtonProps } from '@/Button';
import type { FormInstance, FormProps } from '@/Form';
import type { ModalProps } from '@/Modal';

type PickModalProps = Pick<
  ModalProps,
  | 'style'
  | 'className'
  | 'allowFullscreen'
  | 'title'
  | 'width'
  | 'onCancel'
  | 'open'
  | 'centered'
  | 'destroyOnClose'
  | 'paddings'
  | 'height'
  | 'enableResponsive'
  | 'afterClose'
  | 'afterOpenChange'
  | 'zIndex'
  | 'mask'
  | 'getContainer'
  | 'keyboard'
  | 'forceRender'
  | 'focusTriggerAfterClose'
  | 'closable'
  | 'loading'
  | 'closeIcon'
>;

type PickFormProps = Omit<FormProps, 'className' | 'style' | 'title'>;

export interface FormModalProps extends PickModalProps, PickFormProps {
  classNames?: {
    form?: FormProps['className'];
  } & ModalProps['classNames'];
  onSubmit?: ModalProps['onOk'];
  ref?: Ref<FormInstance>;
  styles?: {
    form?: FormProps['style'];
  } & ModalProps['styles'];
  submitButtonProps?: ButtonProps;
  submitLoading?: ModalProps['confirmLoading'];
  submitText?: ModalProps['okText'];
}
