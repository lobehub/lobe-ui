import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, token, prefixCls, stylish }) => {
  return {
    actions: css`
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: 16px;
      transform: translateY(-50%);
    `,
    active: stylish.active,
    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
      align-self: center;
    `,
    date: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,
    desc: css`
      &.${prefixCls}-typography {
        width: 100%;
        margin: 0;

        font-size: 12px;
        line-height: 1.2;
        color: ${token.colorTextDescription};
      }
    `,

    pin: css`
      position: absolute;
      inset-block-start: 6px;
      inset-inline-end: 6px;
    `,
    root: cx(
      stylish.variantBorderless,
      css`
        cursor: pointer;
        position: relative;
        color: ${token.colorTextTertiary};
        border-radius: ${token.borderRadius}px;
      `,
    ),

    title: css`
      &.${prefixCls}-typography {
        width: 100%;
        margin: 0;

        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        color: ${token.colorText};
      }
    `,
    triangle: css`
      width: 10px;
      height: 10px;

      opacity: 0.5;
      background: ${token.colorPrimaryBorder};
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
      border-radius: 2px;
    `,
  };
});
