import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish, prefixCls }) => {
  return {
    filled: stylish.variantFilled,
    glass: stylish.blur,
    outlined: stylish.variantOutlined,
    root: css`
      &.${prefixCls}-btn {
        transition:
          color 400ms ${token.motionEaseOut},
          background 100ms ${token.motionEaseOut};

        &.${prefixCls}-btn-variant-outlined,&.${prefixCls}-btn-variant-dashed {
          border-color: ${token.colorBorderSecondary};

          &:hover {
            border-color: ${token.colorBorder};
          }
        }

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
