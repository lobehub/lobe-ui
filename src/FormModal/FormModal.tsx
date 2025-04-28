'use client';

import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Button from '@/Button';
import Form from '@/Form';
import Modal from '@/Modal';

import { useStyles } from './style';
import type { FormModalProps } from './type';

const FormModal = memo<FormModalProps>(
  ({
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
    ref,
    ...rest
  }) => {
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
          styles={{
            title: { fontSize: 14 },
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
