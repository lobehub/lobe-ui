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
  | 'destroyOnHidden'
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

type PickFormProps = Omit<FormProps, 'className' | 'style' | 'title' | 'styles' | 'classNames'>;

export interface FormModalProps extends PickModalProps, PickFormProps {
  classNames?: ModalProps['classNames'] & {
    form?: FormProps['className'];
  };
  onSubmit?: ModalProps['onOk'];
  ref?: Ref<FormInstance>;
  styles?: ModalProps['styles'] & {
    form?: FormProps['style'];
  };
  submitButtonProps?: ButtonProps;
  submitLoading?: ModalProps['confirmLoading'];
  submitText?: ModalProps['okText'];
}
