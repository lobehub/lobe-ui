import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ cx, css, token, isDarkMode, stylish }) => {
  return {
    borderless: cx(
      stylish.variantBorderlessWithoutHover,
      css`
        padding-inline: 4px;
      `,
    ),
    filled: stylish.variantFilledWithoutHover,
    inverseTheme: css`
      color: ${rgba(token.colorBgContainer, 0.75)};
      background: ${rgba(token.colorBgContainer, isDarkMode ? 0.08 : 0.16)};
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      overflow: hidden;

      min-width: 16px;
      height: 22px;
      padding-block: 0;
      padding-inline: 8px;

      font-family: ${token.fontFamily};
      font-size: 12px;
      line-height: 1.1;
      color: ${token.colorTextSecondary};
      text-align: center;
      white-space: nowrap;

      border: none;
      border-radius: ${token.borderRadiusSM}px;
    `,
  };
});
