import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ stylish, cx, css, token }) => {
  return {
    borderless: cx(
      stylish.variantBorderlessWithoutHover,
      css`
        border-radius: 0;

        pre,
        textarea {
          padding: 0;
        }
      `,
    ),
    filled: stylish.variantFilledWithoutHover,
    highlight: css`
      pointer-events: none;
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;

      overflow: hidden auto;

      width: 100%;
      height: fit-content;

      font-size: 12px;

      border-radius: ${token.borderRadius}px;

      pre,
      textarea {
        margin: 0;
        padding: 16px;
      }

      textarea,
      pre,
      code {
        overflow: hidden;

        font-family: ${token.fontFamilyCode};
        font-size: inherit;
        line-height: inherit;
        word-break: inherit;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    `,
    textarea: css`
      resize: none;

      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;

      overflow: hidden;

      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0;

      color: transparent;
      text-align: start;

      background: transparent;
      border: none;
      outline: none;
      caret-color: ${token.colorText};

      &::placeholder {
        color: ${token.colorTextQuaternary};
      }

      &:focus {
        border: none;
        outline: none;
        box-shadow: none;
      }
    `,
  };
});
