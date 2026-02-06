'use client';

import { Button, ConfigProvider, Drawer, Modal as AntModal } from 'antd';
import { cssVar, cx, useResponsive } from 'antd-style';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { memo, type ReactNode, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { styles } from './style';
import { type ModalProps } from './type';

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
    const hideFooter = footer === false || footer === null;
    if (enableResponsive && mobile)
      return (
        <ConfigProvider
          theme={{
            token: {
              colorBgElevated: cssVar.colorBgContainer,
            },
          }}
        >
          <Drawer
            className={cx(styles.drawerContent, className)}
            closeIcon={<ActionIcon icon={X} />}
            destroyOnHidden={destroyOnHidden}
            height={fullscreen ? 'calc(100% - env(safe-area-inset-top))' : height}
            open={open}
            panelRef={panelRef}
            placement={'bottom'}
            title={title}
            classNames={
              typeof classNames === 'function'
                ? classNames
                : {
                    ...classNames,
                    wrapper: cx(styles.wrap, classNames?.wrapper),
                  }
            }
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
                        variant={'filled'}
                        onClick={onCancel as any}
                        {...cancelButtonProps}
                      >
                        {cancelText || 'Cancel'}
                      </Button>
                      <Button
                        loading={confirmLoading}
                        type="primary"
                        onClick={onOk as any}
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
            onClose={onCancel as any}
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
            colorBgElevated: cssVar.colorBgContainer,
          },
        }}
      >
        <AntModal
          closable
          maskClosable
          cancelText={cancelText}
          className={cx(styles.content, className)}
          closeIcon={<Icon icon={X} size={20} />}
          confirmLoading={confirmLoading}
          destroyOnHidden={destroyOnHidden}
          footer={hideFooter ? null : footer}
          okButtonProps={okButtonProps}
          okText={okText}
          open={open}
          panelRef={panelRef}
          title={title}
          width={width}
          cancelButtonProps={{
            color: 'default',
            variant: 'filled',
            ...cancelButtonProps,
          }}
          classNames={
            typeof classNames === 'function'
              ? classNames
              : {
                  ...classNames,
                  wrapper: cx(styles.wrap, classNames?.wrapper),
                }
          }
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
          onCancel={onCancel}
          onOk={onOk}
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
