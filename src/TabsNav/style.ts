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
        margin: ${marginHoriz}px 4px !important;
        padding: 0 12px !important;
      }

      ${prefix}-tab {
        color: ${token.colorTextSecondary};
        transition: background-color 100ms ease-out;

        &:first-child {
          margin: ${marginHoriz}px 4px ${marginHoriz}px 0;
          padding: ${paddingVertical}px 12px !important;
        }

        &:hover {
          color: ${token.colorText} !important;
          background: ${token.colorFillTertiary};
          border-radius: ${token.borderRadius}px;
        }
      }

      ${prefix}-nav {
        margin-bottom: 0;

        &::before {
          display: none;
        }
      }
    `,
  };
});
