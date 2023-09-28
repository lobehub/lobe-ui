import { Modal as AntModal, type ModalProps as AntModalProps } from 'antd';
import { Drawer } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { X } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';
import MobileSafeArea from '@/MobileSafeArea';

import { ActionIcon } from '../../es';

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
    overflow-x: hidden;
    overflow-y: auto;
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
    ...props
  }) => {
    const { mobile } = useResponsive();
    const { styles, cx, theme } = useStyles();

    if (mobile)
      return (
        <Drawer
          bodyStyle={{ padding: 0 }}
          closeIcon={<ActionIcon icon={X} size={{ blockSize: 32, fontSize: 20 }} />}
          destroyOnClose={destroyOnClose}
          drawerStyle={{ background: theme.colorBgContainer }}
          headerStyle={{ padding: '8px 4px' }}
          height={'75vh'}
          maskClassName={cx(styles.wrap, wrapClassName)}
          onClose={onCancel as any}
          open={open}
          placement={'bottom'}
          title={title}
        >
          {children}
          <MobileSafeArea position={'bottom'} />
        </Drawer>
      );

    return (
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
        {...props}
      >
        {children}
      </AntModal>
    );
  },
);

export default Modal;
