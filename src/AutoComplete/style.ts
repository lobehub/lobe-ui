import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ prefixCls, css, stylish }) => {
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
    root: css``,
    shadow: css`
      &.${prefixCls}-select {
        > .${prefixCls}-select-selector {
          ${stylish.shadow}
        }
      }
    `,
  };
});
