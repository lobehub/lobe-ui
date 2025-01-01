import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls, responsive }) => ({
  footer: css`
    position: absolute;
    inset-block-end: 0;
    inset-inline: 0;

    width: 100%;
    margin: 0;
    padding: 16px;

    background: ${token.colorBgContainer};
  `,
  form: css`
    position: static;
    .${prefixCls}-form-group-title {
      font-size: 15px;
      font-weight: 500;
    }

    ${responsive.mobile} {
      .${prefixCls}-form-group-title {
        font-size: 14px;
        font-weight: normal;
      }

      .${prefixCls}-form-group {
        width: calc(100% + 32px);
        margin-inline: -16px;
        background: transparent;
      }
    }
  `,
}));
