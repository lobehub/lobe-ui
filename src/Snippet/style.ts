import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: stylish.variantFilledWithoutHover,
    hightlight: css`
      overflow: auto hidden;
      flex: 1;
      height: 100%;
      padding: 0;

      pre {
        display: flex;
        align-items: center;
        height: 100%;
      }
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;

      overflow: hidden;

      max-width: 100%;
      height: 38px;
      padding-block: 0;
      padding-inline: 12px 8px;

      border-radius: ${token.borderRadius}px;
    `,
    shadow: stylish.shadow,
  };
});
