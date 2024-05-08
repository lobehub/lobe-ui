'use client';

import { Modal as AntModal, type ModalProps as AntModalProps, ConfigProvider, Drawer } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { isNumber } from 'lodash-es';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { lighten } from 'polished';
import { ReactNode, memo, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 68;

const useStyles = createStyles(
  ({ cx, css, token, prefixCls }, { maxHeight }: { maxHeight?: string }) => {
    return {
      content: cx(
        maxHeight &&
          css`
            .${prefixCls}-modal-body {
              overflow: auto;
              max-height: ${maxHeight};
            }
          `,
        css`
          .${prefixCls}-modal-footer {
            margin: 0;
            padding: 16px;
          }
          .${prefixCls}-modal-header {
            display: flex;
            gap: 4px;
            align-items: center;
            justify-content: center;

            height: 56px;
            margin-block-end: 0;
            padding: 16px;
          }
          .${prefixCls}-modal-content {
            overflow: hidden;
            padding: 0;
            border: 1px solid ${token.colorSplit};
            border-radius: ${token.borderRadiusLG}px;
          }
        `,
      ),
      drawerContent: css`
        .${prefixCls}-drawer-close {
          padding: 0;
        }
        .${prefixCls}-drawer-wrapper-body {
          background: linear-gradient(to bottom, ${token.colorBgContainer}, ${token.colorBgLayout});
        }
        .${prefixCls}-drawer-header {
          padding: 8px;
        }

        .${prefixCls}-drawer-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          padding: 16px;

          border: none;
        }
      `,
      wrap: css`
        overflow: hidden auto;
        backdrop-filter: blur(2px);
      `,
    };
  },
);

export type ModalProps = AntModalProps & {
  allowFullscreen?: boolean;
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
    footer,
    styles: stylesProps = {},
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
    if (mobile)
      return (
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
          footer={footer as ReactNode}
          height={fullscreen ? '100%' : maxHeight || '75vh'}
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
        >
          {children}
        </Drawer>
      );

    return (
      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: lighten(0.005, theme.colorBgContainer),
          },
        }}
      >
        <AntModal
          className={cx(styles.content, className)}
          closable
          closeIcon={<Icon icon={X} size={{ fontSize: 20 }} />}
          destroyOnClose={destroyOnClose}
          footer={footer}
          maskClosable
          onCancel={onCancel}
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
