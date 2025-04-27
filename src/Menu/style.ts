import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, token, stylish, prefixCls }) => ({
  borderless: cx(
    stylish.variantBorderlessWithoutHover,
    css`
      padding: 0;
      border-radius: unset;
    `,
  ),
  compact: css`
    &.${prefixCls}-menu {
      .${prefixCls}-menu-item-divider {
        margin: 0;
      }
    }
  `,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
  root: css`
    &.${prefixCls}-menu {
      flex: 1;

      padding: 4px;

      background: transparent;
      border: none !important;
      border-radius: ${token.borderRadiusLG}px;

      .${prefixCls}-menu-sub.${prefixCls}-menu-inline {
        background: transparent;
        > .${prefixCls}-menu-item {
          padding-inline-start: 36px !important;
        }
      }

      .${prefixCls}-menu-item-divider {
        margin-block: 1em;
      }
    }
  `,
  shadow: stylish.shadow,
}));
