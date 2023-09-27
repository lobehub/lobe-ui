import { Modal as AntModal, ConfigProvider, ModalProps } from 'antd';
import { createStyles } from 'antd-style';
import { X } from 'lucide-react';
import { lighten } from 'polished';
import { memo } from 'react';

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

      max-height: 70vh;
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

const Modal = memo<ModalProps>(
  ({ children, title, className, wrapClassName, width = 700, ...props }) => {
    const { styles, cx, theme } = useStyles();

    return (
      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: lighten(0.005, theme.colorBgContainer),
          },
        }}
      >
        <AntModal
          centered
          className={cx(styles.content, className)}
          closable
          closeIcon={<Icon icon={X} size={{ fontSize: 20 }} />}
          maskClosable
          title={title}
          width={width}
          wrapClassName={cx(styles.wrap, wrapClassName)}
          {...props}
        >
          {children}
        </AntModal>
      </ConfigProvider>
    );
  },
);

export default Modal;

export { ModalProps } from 'antd';
