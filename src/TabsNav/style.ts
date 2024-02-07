import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  const prefix = `.${prefixCls}-tabs`;

  const marginHoriz = 16;
  const paddingVertical = 6;

  return {
    compact: css`
      .${prefixCls}-tabs-tab {
        margin: 4px !important;

        + .${prefixCls}-tabs-tab {
          margin: 4px !important;
        }
      }
    `,
    tabs: css`
      ${prefix}-tab + ${prefix}-tab {
        margin-block: ${marginHoriz}px !important;
        margin-inline: 4px !important;
        padding-block: 0 !important;
        padding-inline: 12px !important;
      }

      ${prefix}-tab {
        color: ${token.colorTextSecondary};
        transition: background-color 100ms ease-out;

        &:first-child {
          margin-block: ${marginHoriz}px;
          margin-inline: 0 4px;
          padding-block: ${paddingVertical}px !important;
          padding-inline: 12px !important;
        }

        &:hover {
          color: ${token.colorText} !important;
          background: ${token.colorFillTertiary};
          border-radius: ${token.borderRadius}px;
        }
      }

      ${prefix}-nav {
        margin-block-end: 0;

        &::before {
          display: none;
        }
      }
    `,
  };
});
