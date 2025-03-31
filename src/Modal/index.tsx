'use client';

import {
  Modal as AntModal,
  type ModalProps as AntModalProps,
  Button,
  ConfigProvider,
  Drawer,
} from 'antd';
import { useResponsive } from 'antd-style';
import { isNumber } from 'lodash-es';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { ReactNode, memo, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { FOOTER_HEIGHT, HEADER_HEIGHT, useStyles } from './style';

export type ModalProps = Omit<AntModalProps, 'okType'> & {
  allowFullscreen?: boolean;
  enableResponsive?: boolean;
  maxHeight?: string | number | false;
  paddings?: {
    desktop?: number;
    mobile?: number;
  };
};

const Modal = memo<ModalProps>(
  ({
    allowFullscreen,
    children,
    title = ' ',
    className,
    wrapClassName,
    width = 700,
    onCancel,
    open,
    destroyOnClose,
    paddings,
    maxHeight = '75dvh',
    enableResponsive = true,
    footer,
    styles: stylesProps = {},
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
    const { styles, cx, theme } = useStyles({
      maxHeight: maxHeight
        ? `calc(${isNumber(maxHeight) ? `${maxHeight}px` : maxHeight} - ${
            HEADER_HEIGHT + (footer ? FOOTER_HEIGHT : 0)
          }px)`
        : undefined,
    });
    const { body, ...restStyles } = stylesProps;
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
            height={fullscreen ? 'calc(100% - env(safe-area-inset-top))' : maxHeight || '75vh'}
            maskClassName={cx(styles.wrap, wrapClassName)}
            onClose={onCancel as any}
            open={open}
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
          closable
          closeIcon={<Icon icon={X} size={{ fontSize: 20 }} />}
          confirmLoading={confirmLoading}
          destroyOnClose={destroyOnClose}
          footer={hideFooter ? null : footer}
          maskClosable
          okButtonProps={okButtonProps}
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
          open={open}
          styles={{
            body: {
              paddingBlock: `0 ${footer === null ? '16px' : 0}`,
              paddingInline: paddings?.desktop ?? 16,
              ...body,
            },
            ...restStyles,
          }}
          title={title}
          width={width}
          wrapClassName={cx(styles.wrap, wrapClassName)}
          {...rest}
        >
          {children}
        </AntModal>
      </ConfigProvider>
    );
  },
);

export default Modal;
