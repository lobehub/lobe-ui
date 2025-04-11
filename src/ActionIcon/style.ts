import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ isDarkMode, css, token, stylish }) => {
  return {
    active: stylish.active,
    borderless: stylish.variantBorderless,
    dangerBorderless: stylish.variantBorderlessDanger,
    dangerFilled: stylish.variantFilledDanger,
    dangerOutlined: stylish.variantOutlinedDanger,
    dangerRoot: css`
      color: ${token.colorError};
    `,
    disabled: stylish.disabled,
    filled: stylish.variantFilled,
    glass: stylish.blur,
    outlined: stylish.variantOutlined,
    root: css`
      cursor: pointer;

      position: relative;

      overflow: hidden;

      color: ${token.colorTextTertiary};

      transition:
        color 400ms ${token.motionEaseOut},
        background 100ms ${token.motionEaseOut};

      &:hover {
        color: ${token.colorTextSecondary};
      }

      &:active {
        color: ${isDarkMode ? token.colorTextTertiary : token.colorText};
      }
    `,
    shadow: stylish.shadow,
  };
});
