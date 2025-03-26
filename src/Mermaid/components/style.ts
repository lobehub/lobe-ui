import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, stylish }) => {
  return {
    loading: cx(
      stylish.blur,
      css`
        position: absolute;
        z-index: 10;
        inset-block-start: 0;
        inset-inline-end: 0;

        height: 34px;
        padding-block: 0;
        padding-inline: 8px;

        font-family: ${token.fontFamilyCode};
        color: ${token.colorTextTertiary};

        border-radius: ${token.borderRadius};
      `,
    ),
  };
});
