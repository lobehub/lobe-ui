import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ prefixCls, css, token }) => {
  return {
    low: css`
      color: ${token.colorWarningText};
    `,
    normal: css`
      color: ${token.colorSuccessText};
    `,
    overload: css`
      color: ${token.colorErrorText};
    `,
    root: css`
      user-select: none;
      min-width: fit-content;
      height: 28px;
      &.${prefixCls}-btn {
        padding-block: 12px;
        &.${prefixCls}-btn-round {
          padding-inline: 6px 12px;
        }
        &.${prefixCls}-btn-square {
          padding-inline: 6px 12px;
        }
      }
    `,
  };
});
