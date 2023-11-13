import { Modal as AntModal, type ModalProps as AntModalProps, ConfigProvider, Drawer } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { X } from 'lucide-react';
import { lighten } from 'polished';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

const useStyles = createStyles(({ css, token, prefixCls }) => ({
  content: css`
    .${prefixCls}-modal-body {
      overflow: hidden;
      padding: 0 16px 16px;
    }
    .${prefixCls}-modal-footer {
      padding: 0 16px 16px;
    }
    .${prefixCls}-modal-header {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;

      margin-bottom: 0;
      padding: 16px;
    }
    .${prefixCls}-modal-content {
      overflow: hidden;
      padding: 0;
      border: 1px solid ${token.colorSplit};
      border-radius: ${token.borderRadiusLG}px;
    }
  `,
  wrap: css`
    overflow: hidden auto;
    backdrop-filter: blur(2px);
  `,
}));

export type ModalProps = AntModalProps;

const Modal = memo<ModalProps>(
  ({
    children,
    title,
    className,
    wrapClassName,
    width = 700,
    onCancel,
    open,
    destroyOnClose,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { styles, cx, theme } = useStyles();

    if (mobile)
      return (
        <Drawer
          closeIcon={<ActionIcon icon={X} size={{ blockSize: 32, fontSize: 20 }} />}
          destroyOnClose={destroyOnClose}
          drawerStyle={{
            background: `linear-gradient(to bottom, ${theme.colorBgContainer}, ${theme.colorBgLayout})`,
          }}
          height={'75vh'}
          maskClassName={cx(styles.wrap, wrapClassName)}
          onClose={onCancel as any}
          open={open}
          placement={'bottom'}
          styles={{
            body: { padding: 0 },
            header: { padding: '8px 4px' },
            ...rest.styles,
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
          maskClosable
          onCancel={onCancel}
          open={open}
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
