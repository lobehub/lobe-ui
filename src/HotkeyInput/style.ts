import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish }) => {
  return {
    borderless: stylish.variantBorderless,
    disabled: stylish.disabled,
    error: css`
      border: 1px solid ${token.colorError};
    `,
    errorText: css`
      font-size: 12px;
      color: ${token.colorError};
    `,
    filled: stylish.variantFilled,
    focused: css`
      background: ${token.colorFillSecondary} !important;
    `,
    hiddenInput: css`
      cursor: text;

      position: absolute;
      z-index: -1;
      inset-block-start: 0;
      inset-inline-start: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    `,
    outlined: stylish.variantOutlined,
    placeholder: css`
      color: ${token.colorTextDescription};
    `,
    root: css`
      cursor: pointer;

      position: relative;

      max-width: 100%;
      height: 36px;
      padding-block: 0;
      padding-inline: 12px;

      border-radius: ${token.borderRadius}px;
    `,
    shadow: stylish.shadow,
  };
});
