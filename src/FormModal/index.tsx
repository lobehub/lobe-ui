'use client';

import { useResponsive } from 'antd-style';
import { forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import Button, { type ButtonProps } from '@/Button';
import Form, { type FormInstance, type FormProps } from '@/Form';
import Modal, { type ModalProps } from '@/Modal';

import { useStyles } from './style';

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
  styles?: {
    form?: FormProps['style'];
  } & ModalProps['styles'];
  submitButtonProps?: ButtonProps;
  submitLoading?: ModalProps['confirmLoading'];
  submitText?: ModalProps['okText'];
}

const FormModal = forwardRef<FormInstance, FormModalProps>(
  (
    {
      classNames = {},
      className,
      style,
      closable,
      styles = {},
      allowFullscreen,
      title,

      afterOpenChange,
      width,
      onCancel,
      centered,
      open,
      afterClose,
      destroyOnClose,
      closeIcon,
      paddings,
      height,
      enableResponsive,
      zIndex,
      mask,
      getContainer,
      keyboard,
      focusTriggerAfterClose,
      forceRender,
      loading,
      footer,
      submitButtonProps,
      submitLoading,
      onFinish,
      submitText,
      variant = 'borderless',
      gap,
      onSubmit,
      children,
      ...rest
    },
    ref,
  ) => {
    const { mobile } = useResponsive();
    const { cx, styles: s } = useStyles();
    const { form: formClassName, footer: footerClassName, ...modalClassNames } = classNames;
    const { form: formStyle, ...modalStyles } = styles;

    return (
      <Modal
        afterClose={afterClose}
        afterOpenChange={afterOpenChange}
        allowFullscreen={allowFullscreen}
        centered={centered}
        className={className}
        classNames={modalClassNames}
        closable={closable}
        closeIcon={closeIcon}
        confirmLoading={submitLoading}
        destroyOnClose={destroyOnClose}
        enableResponsive={enableResponsive}
        focusTriggerAfterClose={focusTriggerAfterClose}
        footer={null}
        forceRender={forceRender}
        getContainer={getContainer}
        height={height}
        keyboard={keyboard}
        loading={loading}
        mask={mask}
        onCancel={onCancel}
        open={open}
        paddings={paddings}
        style={style}
        styles={{
          ...modalStyles,
          body: {
            paddingTop: mobile ? 0 : undefined,
            ...modalStyles?.body,
          },
        }}
        title={title}
        width={width}
        zIndex={zIndex}
      >
        <Form
          className={cx(s.form, formClassName)}
          clearOnDestroy={destroyOnClose}
          footer={
            footer || (
              <Flexbox
                align={'center'}
                className={cx(s.footer, footerClassName)}
                gap={8}
                horizontal
              >
                <Button
                  block
                  htmlType="submit"
                  loading={submitLoading}
                  onClick={onSubmit}
                  type={'primary'}
                  {...submitButtonProps}
                  style={{
                    flex: 1,
                    ...submitButtonProps?.style,
                  }}
                >
                  {submitText || 'Submit'}
                </Button>
              </Flexbox>
            )
          }
          gap={gap || (variant === 'borderless' ? 24 : gap)}
          onFinish={onFinish}
          ref={ref}
          style={{
            paddingBottom: 56,
            ...formStyle,
          }}
          variant={variant}
          {...rest}
        >
          {children}
        </Form>
      </Modal>
    );
  },
);

FormModal.displayName = 'FormModal';

export default FormModal;
