'use client';

import {
  Modal as AntModal,
  type ModalProps as AntModalProps,
  Button,
  ConfigProvider,
  Drawer,
} from 'antd';
import { useResponsive } from 'antd-style';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { ReactNode, forwardRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { useStyles } from './style';

export type ModalProps = Omit<AntModalProps, 'okType' | 'wrapClassName'> & {
  allowFullscreen?: boolean;
  enableResponsive?: boolean;
  paddings?: {
    desktop?: number;
    mobile?: number;
  };
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      allowFullscreen,
      children,
      title = ' ',
      className,
      classNames,
      width = 700,
      onCancel,
      open,
      destroyOnClose,
      paddings,
      height = '75dvh',
      enableResponsive = true,
      footer,
      styles: customStyles,
      okText,
      onOk,
      cancelText,
      okButtonProps,
      cancelButtonProps,
      confirmLoading,
      ...rest
    },
    ref,
  ) => {
    const [fullscreen, setFullscreen] = useState(false);
    const { mobile } = useResponsive();
    const { styles, cx, theme } = useStyles();
    const { body, ...restStyles } = customStyles || {};
    const hideFooter = footer === false || footer === null;
    if (enableResponsive && mobile)
      return (
        <ConfigProvider
          theme={{
            token: {
              colorBgElevated: theme.colorBgContainer,
            },
          }}
        >
          <Drawer
            className={cx(styles.drawerContent, className)}
            classNames={{
              ...classNames,
              wrapper: cx(styles.wrap, classNames?.wrapper),
            }}
            closeIcon={<ActionIcon icon={X} />}
            destroyOnClose={destroyOnClose}
            extra={
              allowFullscreen && (
                <ActionIcon
                  icon={fullscreen ? Minimize2 : Maximize2}
                  onClick={() => setFullscreen(!fullscreen)}
                />
              )
            }
            footer={
              hideFooter
                ? null
                : (footer as ReactNode) || (
                    <>
                      <Button
                        color={'default'}
                        onClick={onCancel as any}
                        variant={'filled'}
                        {...cancelButtonProps}
                      >
                        {cancelText || 'Cancel'}
                      </Button>
                      <Button
                        loading={confirmLoading}
                        onClick={onOk as any}
                        type="primary"
                        {...okButtonProps}
                        style={{
                          marginInlineStart: 8,
                          ...okButtonProps?.style,
                        }}
                      >
                        {okText || 'OK'}
                      </Button>
                    </>
                  )
            }
            height={fullscreen ? 'calc(100% - env(safe-area-inset-top))' : height}
            onClose={onCancel as any}
            open={open}
            panelRef={ref}
            placement={'bottom'}
            styles={{
              body: {
                paddingBlock: `16px ${footer ? 0 : '16px'}`,
                paddingInline: paddings?.desktop ?? 16,
                ...body,
              },
              ...restStyles,
            }}
            title={title}
            {...rest}
          >
            {children}
          </Drawer>
        </ConfigProvider>
      );

    return (
      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: theme.colorBgContainer,
          },
        }}
      >
        <AntModal
          cancelButtonProps={{
            color: 'default',
            variant: 'filled',
            ...cancelButtonProps,
          }}
          cancelText={cancelText}
          className={cx(styles.content, className)}
          classNames={{
            ...classNames,
            wrapper: cx(styles.wrap, classNames?.wrapper),
          }}
          closable
          closeIcon={<Icon icon={X} size={20} />}
          confirmLoading={confirmLoading}
          destroyOnClose={destroyOnClose}
          footer={hideFooter ? null : footer}
          maskClosable
          okButtonProps={okButtonProps}
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
          open={open}
          panelRef={ref}
          styles={{
            body: {
              maxHeight: height,
              overflow: 'hidden auto',
              paddingBlock: `0 ${footer === null ? '16px' : 0}`,
              paddingInline: paddings?.desktop ?? 16,
              ...body,
            },
            ...restStyles,
          }}
          title={title}
          width={width}
          {...rest}
        >
          {children}
        </AntModal>
      </ConfigProvider>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
