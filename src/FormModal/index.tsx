import { Button } from 'antd';
import { useResponsive } from 'antd-style';
import { forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import Form, { type FormInstance, type FormProps } from '@/Form';
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
  onSubmit?: ModalProps['onOk'];
  styles?: {
    form?: FormProps['style'];
  } & ModalProps['styles'];
  submitButtonProps?: ModalProps['okButtonProps'];
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
      children,
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
      submitButtonProps,
      submitLoading,
      onFinish,
      submitText,
      variant = 'pure',
      gap,
      onSubmit,
      ...rest
    },
    ref,
  ) => {
    const { mobile } = useResponsive();
    const { cx, styles: s } = useStyles();
    const { form: formClassName, footer: footerClassName, ...modalClassNames } = classNames;
    const { form: formStyle, footer: footerStyle, ...modalStyles } = styles;

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
          gap={gap || (variant === 'pure' ? 24 : gap)}
          onFinish={onFinish}
          ref={ref}
          style={formStyle}
          variant={variant}
          {...rest}
        >
          {children}
          <Flexbox
            className={cx(s.footer, footerClassName)}
            gap={8}
            horizontal
            style={footerStyle}
            width={'100%'}
          >
            {footer || (
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
            )}
          </Flexbox>
        </Form>
      </Modal>
    );
  },
);

export default FormModal;
