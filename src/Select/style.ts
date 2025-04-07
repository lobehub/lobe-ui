import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ prefixCls, token, css, stylish }) => {
  return {
    borderless: css`
      &.${prefixCls}-select {
        > .${prefixCls}-select-selector {
          ${stylish.variantBorderless}
        }
      }
    `,
    filled: css`
      &.${prefixCls}-select {
        > .${prefixCls}-select-selector {
          ${stylish.variantFilled}
        }
      }
    `,
    outlined: css`
      &.${prefixCls}-select {
        > .${prefixCls}-select-selector {
          ${stylish.variantOutlined}
        }
      }
    `,
    root: css`
      &.${prefixCls}-select {
        > .${prefixCls}-select-selector {
          border: none !important;
        }

        &.${prefixCls}-select-focused {
          > .${prefixCls}-select-selector {
            background: ${token.colorFillTertiary} !important;
          }
        }
      }
    `,
    shadow: stylish.shadow,
  };
});
