import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, prefixCls }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    shiki: cx(
      `${prefix}-shiki`,
      css`
        .shiki {
          overflow-x: scroll;

          .line {
            font-family: ${token.fontFamilyHighlighter};
          }
        }
      `,
    ),

    prism: cx(
      `${prefix}-prism`,
      css`
        code[class*='language-'] {
          background: none !important;
        }
      `,
    ),

    loading: css`
      position: absolute;
      top: 8px;
      right: 12px;
      color: ${token.colorTextTertiary};
    `,
  };
});
