import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls, responsive }) => ({
  footer: css`
    width: calc(100% + 32px);
    margin: -16px;
    padding: 16px;
    background: ${token.colorBgContainer};
    ${responsive.mobile} {
      position: fixed;
      inset-block-end: 0;
      inset-inline: 0;

      width: 100%;
      margin: 0;
    }
  `,
  form: css`
    .${prefixCls}-form-group-title {
      font-size: 15px;
      font-weight: 500;
    }

    ${responsive.mobile} {
      .${prefixCls}-form-group-title {
        font-size: 14px;
      }

      .${prefixCls}-form-group {
        width: calc(100% + 32px);
        margin-inline: -16px;
        background: transparent;
      }
    }
  `,
}));
