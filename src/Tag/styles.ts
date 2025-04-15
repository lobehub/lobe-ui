import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ stylish, prefixCls, css, token }) => ({
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  large: css`
    &.${prefixCls}-tag {
      height: 28px;
      padding-inline: 12px;
      border-radius: 6px;
    }
  `,
  outlined: stylish.variantOutlinedWithoutHover,
  root: css`
    color: ${token.colorTextSecondary};
    &.${prefixCls}-tag {
      user-select: none;

      display: flex;
      gap: 0.4em;
      align-items: center;
      justify-content: center;

      height: 22px;
      margin: 0;
      border-radius: 3px;

      line-height: 1.2;

      span {
        margin: 0;
      }

      span:not(.anticon) {
        height: unset;
        line-height: inherit;
      }
    }
  `,
  small: css`
    &.${prefixCls}-tag {
      height: 20px;
      padding-inline: 4px;
    }
  `,
}));
