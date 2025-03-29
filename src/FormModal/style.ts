import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, prefixCls, responsive }) => ({
  footer: css`
    position: absolute;
    z-index: 10;
    inset-block-end: 0;
    inset-inline: 0;

    width: 100%;
    margin: 0;
    padding: 16px;

    background: linear-gradient(
      to bottom,
      ${rgba(token.colorBgContainer, 0)} 0%,
      ${token.colorBgContainer} 10%
    );
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
