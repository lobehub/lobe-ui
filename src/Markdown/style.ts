import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, isDarkMode },
    {
      fontSize = 14,
      headerMultiple = 0.25,
      marginMultiple = 1,
      lineHeight = 1.6,
    }: { fontSize?: number; headerMultiple?: number; lineHeight?: number; marginMultiple?: number },
  ) => {
    const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;
    return {
      chat: css`
        --lobe-markdown-font-size: ${fontSize}px;
        --lobe-markdown-header-multiple: ${headerMultiple};
        --lobe-markdown-margin-multiple: ${marginMultiple};
        --lobe-markdown-line-height: ${lineHeight};
        --lobe-markdown-border-radius: ${token.borderRadius};

        margin-block: ${marginMultiple * -0.75}em;

        ol,
        ul {
          li {
            &::marker {
              color: ${cyanColor};
            }

            li {
              &::marker {
                color: ${token.colorTextSecondary};
              }
            }
          }
        }

        ul {
          list-style: unset;

          li {
            &::before {
              content: unset;
              display: unset;
            }
          }
        }
      `,
    };
  },
);
