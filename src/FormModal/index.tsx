'use client';

import { useResponsive } from 'antd-style';
import { forwardRef } from 'react';

import Form, { type FormInstance, type FormProps } from '@/Form';
import { type FormSubmitFooterProps } from '@/Form/components/FormSubmitFooter';
import Modal, { type ModalProps } from '@/Modal';

import { useStyles } from './style';

type PickModalProps = Pick<
  ModalProps,
  | 'style'
  | 'className'
  | 'allowFullscreen'
  | 'title'
  | 'wrapClassName'
  | 'width'
  | 'onCancel'
  | 'open'
  | 'centered'
  | 'destroyOnClose'
  | 'paddings'
  | 'maxHeight'
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
  footerProps?: FormSubmitFooterProps;
  onSubmit?: ModalProps['onOk'];
  styles?: {
    form?: FormProps['style'];
  } & ModalProps['styles'];
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
      wrapClassName,
      afterOpenChange,
      width,
      onCancel,
      centered,
      open,
      afterClose,
      destroyOnClose,
      closeIcon,
      paddings,
      maxHeight,
      enableResponsive,
      zIndex,
      mask,
      getContainer,
      keyboard,
      focusTriggerAfterClose,
      forceRender,
      loading,
      footer,
      footerProps,
      onFinish,

      variant = 'pure',
      gap,

      children,
      ...rest
    },
    ref,
  ) => {
    const { mobile } = useResponsive();
    const { cx, styles: s } = useStyles();
    const { form: formClassName, ...modalClassNames } = classNames;
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
        destroyOnClose={destroyOnClose}
        enableResponsive={enableResponsive}
        focusTriggerAfterClose={focusTriggerAfterClose}
        footer={null}
        forceRender={forceRender}
        getContainer={getContainer}
        keyboard={keyboard}
        loading={loading}
        mask={mask}
        maxHeight={maxHeight}
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
        wrapClassName={wrapClassName}
        zIndex={zIndex}
      >
        <Form
          className={cx(s.form, formClassName)}
          clearOnDestroy={destroyOnClose}
          footer={
            footer || (
              <Form.SubmitFooter
                {...footerProps}
                className={cx(s.footer, footerProps?.className)}
              />
            )
          }
          gap={gap || (variant === 'pure' ? 24 : gap)}
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

export default FormModal;
