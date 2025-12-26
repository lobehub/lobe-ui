'use client';

import { Modal as AntModal, Button, ConfigProvider, Drawer } from 'antd';
import { cx, useResponsive, useTheme } from 'antd-style';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { ReactNode, memo, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { styles } from './style';
import type { ModalProps } from './type';

const Modal = memo<ModalProps>(
  ({
    panelRef,
    allowFullscreen,
    children,
    title = ' ',
    className,
    classNames,
    width = 700,
    onCancel,
    open,
    destroyOnHidden,
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
  }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const { mobile } = useResponsive();
    const theme = useTheme();
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
            classNames={
              typeof classNames === 'function'
                ? classNames
                : {
                    ...classNames,
                    wrapper: cx(styles.wrap, classNames?.wrapper),
                  }
            }
            closeIcon={<ActionIcon icon={X} />}
            destroyOnHidden={destroyOnHidden}
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
            panelRef={panelRef}
            placement={'bottom'}
            styles={
              typeof customStyles === 'function'
                ? customStyles
                : {
                    ...customStyles,
                    body: {
                      paddingBlock: `16px ${footer ? 0 : '16px'}`,
                      paddingInline: paddings?.desktop ?? 16,
                      ...customStyles?.body,
                    },
                  }
            }
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
          classNames={
            typeof classNames === 'function'
              ? classNames
              : {
                  ...classNames,
                  wrapper: cx(styles.wrap, classNames?.wrapper),
                }
          }
          closable
          closeIcon={<Icon icon={X} size={20} />}
          confirmLoading={confirmLoading}
          destroyOnHidden={destroyOnHidden}
          footer={hideFooter ? null : footer}
          maskClosable
          okButtonProps={okButtonProps}
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
          open={open}
          panelRef={panelRef}
          styles={
            typeof customStyles === 'function'
              ? customStyles
              : {
                  ...customStyles,
                  body: {
                    maxHeight: height,
                    overflow: 'hidden auto',
                    paddingBlock: `0 ${footer === null ? '16px' : 0}`,
                    paddingInline: paddings?.desktop ?? 16,
                    ...customStyles?.body,
                  },
                }
          }
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
