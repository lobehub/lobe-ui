import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish, prefixCls }) => {
  return {
    glass: stylish.blur,
    root: css`
      &.${prefixCls}-btn {
        > .${prefixCls}-btn-icon {
          display: flex;
        }
      }
    `,
    shadow: css`
      box-shadow: ${token.boxShadowTertiary} !important;
    `,
  };
});
