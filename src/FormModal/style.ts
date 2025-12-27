import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
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
      color-mix(in srgb, ${cssVar.colorBgContainer} 0%, transparent) 0%,
      ${cssVar.colorBgContainer} 10%
    );
  `,
  form: css`
    position: static;
    .${prefixCls}-form-group-title {
      font-size: 15px;
      font-weight: 500;
    }

    ${responsive.sm} {
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
