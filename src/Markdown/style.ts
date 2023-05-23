import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => {
  return {
    container: css`
      p {
        margin: 20px auto;
        line-height: 2;
        word-wrap: break-word;
        font-size: 14px;
        color: ${token.colorText};
      }

      p:not(:last-child) {
        margin-bottom: 1em;
      }

      blockquote p {
        color: ${token.colorTextDescription};
      }

      ol,
      ul {
        li {
          line-height: 2;
          display: list-item;
        }
      }
    `,

    code: css`
      padding: 2px 4px;
      font-family: ${token.fontFamilyCode} !important;
      color: ${isDarkMode ? token.cyan8 : token.pink7};
      border-radius: 4px;
    `,
  };
});
