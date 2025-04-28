import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, stylish, token, isDarkMode }) => ({
  borderless: stylish.variantBorderlessWithoutHover,
  close: css`
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
  `,
  content: css`
    padding: 16px;
  `,
  cover: css`
    align-self: center;
  `,
  desc: css`
    color: ${token.colorTextDescription};
  `,
  filled: cx(
    stylish.variantFilledWithoutHover,
    css`
      background: linear-gradient(
        to bottom,
        ${isDarkMode ? token.colorFillTertiary : token.colorFillQuaternary},
        ${isDarkMode ? token.colorFillQuaternary : token.colorFillTertiary}
      );
    `,
  ),
  outlined: stylish.variantOutlinedWithoutHover,
  root: css`
    position: relative;
    overflow: hidden;
    border-radius: ${token.borderRadiusLG}px;
  `,
  shadow: stylish.shadow,
  title: css`
    font-size: 16px;
    font-weight: bold;
  `,
}));
