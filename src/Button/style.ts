import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish, prefixCls }) => {
  return {
    filled: css`
      &.${prefixCls}-btn.${prefixCls}-btn-variant-filled {
        ${stylish.variantFilled};
        border: none;
      }
    `,
    glass: stylish.blur,
    outlined: css`
      &.${prefixCls}-btn.${prefixCls}-btn-variant-outlined {
        ${stylish.variantOutlined}
        border: none;
      }
    `,
    root: css`
      &.${prefixCls}-btn {
        transition:
          color 400ms ${token.motionEaseOut},
          background 100ms ${token.motionEaseOut};

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
