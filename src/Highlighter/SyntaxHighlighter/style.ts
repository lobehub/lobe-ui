import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, prefixCls, stylish }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    loading: cx(
      stylish.blur,
      css`
        position: absolute;
        z-index: 10;
        top: 0;
        right: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        height: 34px;
        padding: 0 8px;

        font-family: ${token.fontFamilyCode};
        color: ${token.colorTextTertiary};

        border-radius: ${token.borderRadius};
      `,
    ),
    prism: css`
      pre {
        overflow-x: scroll;
        font-family: ${token.fontFamilyCode} !important;
      }
    `,

    shiki: cx(
      `${prefix}-shiki`,
      css`
        .shiki {
          overflow-x: scroll;
          background: none !important;
        }
      `,
    ),
  };
});
