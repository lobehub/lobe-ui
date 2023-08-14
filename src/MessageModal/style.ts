import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, prefixCls }) => ({
  body: css`
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 70vh;
  `,
  modal: css`
    .${prefixCls}-modal-content {
      padding: 16px;
    }
    .${prefixCls}-modal-header {
      margin-bottom: 16px;
    }
  `,
}));
