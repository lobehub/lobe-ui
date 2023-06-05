import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, prefixCls, css }) => {
  const prefix = `.${prefixCls}-tabs`;

  const marginBlock = 8;

  return {
    cls: css`
      ${prefix}-tab + ${prefix}-tab {
        margin: 8px 4px !important;
        margin-block: ${marginBlock}px;
        padding: 0 12px !important;
      }

      ${prefix}-tab {
        color: ${token.colorTextSecondary};
        transition: background-color 150ms ease-out;

        &:first-child {
          margin-block: ${marginBlock}px;
          margin-inline: 0 4px;
          padding: 4px 12px !important;
        }

        &:hover {
          color: ${token.colorText} !important;
          background: ${token.colorFillTertiary};
          border-radius: 6px;
        }
      }
    `,
  };
});
