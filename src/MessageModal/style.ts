import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, prefixCls }) => ({
  modal: css`
    height: 70%;
    .${prefixCls}-modal-header {
      margin-bottom: 24px;
    }
  `,
  body: css`
    overflow-y: scroll;
    max-height: 70vh;
  `,
}));
